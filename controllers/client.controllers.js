const Client = require('../models/Client.model')

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

        const response = await googleMapsClient.geocode({
            params: {
                address,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.results.length === 0) {
            return res.status(400).json({ message: 'No se encontraron coordenadas para la dirección proporcionada.' });
        }

        const { lat, lng } = response.data.results[0].geometry.location;

        const newClient = new Client({
            ...clientData,
            address,
            position: {
                lat,
                lng
            }
        });

        const savedClient = await newClient.save();
        res.json(savedClient);
    } catch (err) {
        next(err);
    }
};

const updateClient = async (req, res, next) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedClient);
    } catch (err) {
        next(err);
    }
};

const deleteClient = async (req, res, next) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
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