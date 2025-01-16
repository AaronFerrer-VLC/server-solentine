const geocodingServices = require('../services/geocoding.services');
const router = require('express').Router();

router.get('/coordinates', async (req, res, next) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ error: 'El parámetro "address" es requerido' });
        }

        const geocodeResult = await geocodingServices.getCoordinates(address);
        res.json(geocodeResult);
    } catch (error) {
        console.error(`ERROR GET /api/geocoding/coordinates: ${error.message}`, error.response?.data);
        res.status(500).json({ error: 'No se pudieron obtener las coordenadas' });
    }
});

router.get('/apikey', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

module.exports = router;