const geocodingServices = require('../services/geocoding.services');
const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');

/**
 * IMPORTANTE: El endpoint /apikey ha sido eliminado por seguridad.
 * La API key de Google Maps ahora se configura directamente en el cliente
 * mediante la variable de entorno VITE_GOOGLE_MAPS_API_KEY
 * 
 * Esto evita exponer la API key a través del backend y mejora la seguridad.
 */

router.get('/coordinates', verifyToken, async (req, res, next) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ 
                status: 'error',
                message: 'El parámetro "address" es requerido' 
            });
        }

        const geocodeResult = await geocodingServices.getCoordinates(address);
        
        // Verificar si hay errores en la respuesta de Google
        if (geocodeResult.status && geocodeResult.status !== 'OK' && geocodeResult.status !== 'ZERO_RESULTS') {
            return res.status(400).json({
                status: 'error',
                message: geocodeResult.error_message || `Error de geocodificación: ${geocodeResult.status}`,
                code: geocodeResult.status
            });
        }

        res.json(geocodeResult);
    } catch (error) {
        console.error(`ERROR GET /api/geocoding/coordinates: ${error.message}`, error.response?.data);
        
        // Manejar errores específicos de Google Maps
        let statusCode = error.response?.status || 500;
        let errorMessage = error.message || 'No se pudieron obtener las coordenadas';
        
        // Mensajes más claros para errores comunes
        if (error.message?.includes('referer restrictions')) {
            statusCode = 503; // Service Unavailable
            errorMessage = 'Error de configuración de Google Maps API. Contacta con el administrador.';
        } else if (error.message?.includes('billing')) {
            statusCode = 503;
            errorMessage = 'El servicio de geocodificación no está disponible. Contacta con el administrador.';
        } else if (error.code === 'REQUEST_DENIED') {
            statusCode = 503;
            errorMessage = 'Error de configuración de Google Maps API. Contacta con el administrador.';
        }
        
        res.status(statusCode).json({ 
            status: 'error',
            message: errorMessage,
            code: error.code || error.response?.data?.status
        });
    }
});

module.exports = router;