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

        const newZone = new Zone({
            ...zoneData,
            address,
            position: {
                lat,
                lng
            }
        })

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