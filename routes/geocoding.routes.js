const geocodingServices = require('../services/geocoding.services')
const router = require('express').Router()

router.get('/coordinates', async (req, res, next) => {
    try {
        const { address } = req.query

        if (!address) {
            return res.status(400).json({ error: 'El parámetro "address" es requerido' })
        }

        const geocodeResult = await geocodingServices.getCoordinates(address)
        res.json(geocodeResult.data)
    } catch (error) {
        next(error)
    }
})

module.exports = router