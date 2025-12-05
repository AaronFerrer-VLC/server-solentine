const Zone = require('../models/Zone.model');
const { Client: GoogleMapsClient } = require('@googlemaps/google-maps-services-js');

const googleMapsClient = new GoogleMapsClient({});

const getAllZones = async (req, res, next) => {
    try {
        const zones = await Zone.find();
        res.json(zones);
    } catch (err) {
        next(err);
    }
};

const createZone = async (req, res, next) => {
    try {
        const { address, ...zoneData } = req.body;

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
                console.error('Error en geocodificación:', err.message);
                
                if (err.message?.includes('billing') || err.code === 'BILLING_NOT_ENABLED') {
                    return res.status(503).json({ 
                        status: 'error',
                        message: 'El servicio de geocodificación no está disponible temporalmente.',
                        code: 'BILLING_NOT_ENABLED'
                    });
                }
                
                console.warn('⚠️  Zona creada sin coordenadas debido a error de geocodificación');
            }
        }

        const newZone = new Zone({
            ...zoneData,
            address,
            ...(position && { position })
        });

        const savedZone = await newZone.save();
        res.json(savedZone);
    } catch (err) {
        next(err);
    }
}

const updateZone = async (req, res, next) => {
    try {
        const updatedZone = await Zone.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedZone)
    } catch (err) {
        next(err)
    }
}

const deleteZone = async (req, res, next) => {
    try {
        await Zone.findByIdAndDelete(req.params.id)
        res.json({ message: 'Zone deleted' })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllZones,
    createZone,
    updateZone,
    deleteZone
}