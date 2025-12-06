const Client = require('../models/Client.model')
const { NotFoundError } = require('../utils/errors');
const { Client: GoogleMapsClient } = require('@googlemaps/google-maps-services-js');

const googleMapsClient = new GoogleMapsClient({})

const getAllClients = async (req, res, next) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        next(err);
    }
};

const getClientByName = async (req, res, next) => {
    try {
        const client = await Client.findOne({ name: req.params.name });
        res.json(client);
    } catch (err) {
        next(err);
    }
};

const createClient = async (req, res, next) => {
    try {
        const { address, ...clientData } = req.body;

        // Solo geocodificar si se proporciona una dirección
        // Si el cliente ya tiene coordenadas, usarlas directamente
        let position = null;

        if (address) {
            try {
                const response = await googleMapsClient.geocode({
                    params: {
                        address,
                        key: process.env.GOOGLE_MAPS_API_KEY
                    }
                });

                // Verificar errores de Google Maps
                if (response.data.status && response.data.status !== 'OK') {
                    // Si es error de facturación, dar mensaje más claro
                    if (response.data.status === 'REQUEST_DENIED' && response.data.error_message?.includes('billing')) {
                        return res.status(503).json({ 
                            status: 'error',
                            message: 'El servicio de geocodificación no está disponible. Contacta con el administrador.',
                            code: 'BILLING_NOT_ENABLED'
                        });
                    }
                    
                    return res.status(400).json({ 
                        status: 'error',
                        message: response.data.error_message || `Error de geocodificación: ${response.data.status}`,
                        code: response.data.status
                    });
                }

                if (response.data.results.length === 0) {
                    return res.status(400).json({ 
                        status: 'error',
                        message: 'No se encontraron coordenadas para la dirección proporcionada.' 
                    });
                }

                const { lat, lng } = response.data.results[0].geometry.location;
                position = { lat, lng };
            } catch (err) {
                // Manejar errores de la API de Google Maps
                console.error('Error en geocodificación:', err.message);
                
                // Si es error de facturación, no fallar silenciosamente
                if (err.message?.includes('billing') || err.code === 'BILLING_NOT_ENABLED') {
                    return res.status(503).json({ 
                        status: 'error',
                        message: 'El servicio de geocodificación no está disponible temporalmente.',
                        code: 'BILLING_NOT_ENABLED'
                    });
                }
                
                // Para otros errores, permitir crear el cliente sin coordenadas
                console.warn('⚠️  Cliente creado sin coordenadas debido a error de geocodificación');
            }
        }

        const newClient = new Client({
            ...clientData,
            address,
            ...(position && { position })
        });

        const savedClient = await newClient.save();
        res.json(savedClient);
    } catch (err) {
        next(err);
    }
};

const updateClient = async (req, res, next) => {
    try {
        const client = await Client.findById(req.params.id);
        
        if (!client) {
            return next(new NotFoundError('Client'));
        }

        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedClient);
    } catch (err) {
        next(err);
    }
};

const deleteClient = async (req, res, next) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        
        if (!client) {
            return next(new NotFoundError('Client'));
        }

        res.json({ message: 'Client deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllClients,
    getClientByName,
    createClient,
    updateClient,
    deleteClient
};