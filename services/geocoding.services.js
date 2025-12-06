const axios = require('axios')

const GOOGLE_MAPS_API_BASE_URL = process.env.GOOGLE_MAPS_BASE_URL || 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Servicio de Geocodificación
 * 
 * IMPORTANTE: Este servicio hace llamadas a Google Maps Geocoding API.
 * 
 * Para minimizar costes:
 * - Las direcciones se geocodifican solo cuando es necesario
 * - Los resultados se guardan en la base de datos para reutilización
 * - Se valida que la API key esté configurada
 * 
 * Errores comunes y soluciones:
 * - BILLING_NOT_ENABLED_MAP_ERROR: Activar facturación en Google Cloud Console
 * - OVER_QUERY_LIMIT: Reducir frecuencia de llamadas o aumentar cuota
 * - REQUEST_DENIED: Verificar API key y restricciones
 */
class GeocodingService {
    constructor() {
        if (!GOOGLE_MAPS_API_KEY) {
            console.warn('⚠️  GOOGLE_MAPS_API_KEY no está configurada en .env');
        }

        this.axiosApp = axios.create({
            baseURL: GOOGLE_MAPS_API_BASE_URL,
            timeout: 10000 // 10 segundos timeout
        });
    }

    /**
     * Obtiene coordenadas de una dirección usando Google Maps Geocoding API
     * 
     * @param {string} address - Dirección a geocodificar
     * @returns {Promise<Object>} - Resultado de geocodificación de Google
     * 
     * @throws {Error} Si hay error en la llamada a la API
     */
    async getCoordinates(address) {
        if (!GOOGLE_MAPS_API_KEY) {
            throw new Error('GOOGLE_MAPS_API_KEY no está configurada');
        }

        if (!address || typeof address !== 'string' || address.trim() === '') {
            throw new Error('La dirección es requerida');
        }

        try {
            const url = `${GOOGLE_MAPS_API_BASE_URL}?address=${encodeURIComponent(address.trim())}&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await this.axiosApp.get(url);
            
            const result = response.data;

            // Verificar errores en la respuesta de Google
            if (result.status && result.status !== 'OK' && result.status !== 'ZERO_RESULTS') {
                const error = new Error(result.error_message || `Error de geocodificación: ${result.status}`);
                error.status = result.status;
                error.code = result.status;
                
                // Log específico para errores de facturación
                if (result.status === 'REQUEST_DENIED' && result.error_message?.includes('billing')) {
                    console.error(`
⚠️  ERROR DE FACTURACIÓN DE GOOGLE MAPS:
${result.error_message}

ACCIÓN REQUERIDA:
1. Ve a Google Cloud Console: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a "Facturación" y habilita una cuenta de facturación
4. Verifica que las APIs estén habilitadas:
   - Maps JavaScript API
   - Geocoding API
                    `);
                }
                
                // Log específico para errores de restricciones de referer
                if (result.status === 'REQUEST_DENIED' && result.error_message?.includes('referer restrictions')) {
                    console.error(`
⚠️  ERROR DE RESTRICCIONES DE REFERER EN GOOGLE MAPS:
${result.error_message}

PROBLEMA:
La Geocoding API de Google Maps NO acepta restricciones de referer (HTTP referrer).
Solo acepta restricciones de IP o ninguna restricción.

SOLUCIÓN:
1. Ve a Google Cloud Console: https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a "APIs & Services" > "Credentials"
4. Edita tu API key
5. En "Application restrictions", cambia de "HTTP referrers" a:
   - "IP addresses" (recomendado para servidor backend)
   - O "None" (menos seguro, solo para desarrollo)
6. Guarda los cambios

NOTA: Si usas la misma API key para el frontend (Maps JavaScript API), 
necesitarás crear una API key separada para el backend con restricciones de IP.
                    `);
                }
                
                throw error;
            }

            return result;
        } catch (error) {
            // Si es error de axios, extraer información útil
            if (error.response) {
                const data = error.response.data;
                if (data.status) {
                    const apiError = new Error(data.error_message || `Error: ${data.status}`);
                    apiError.status = data.status;
                    apiError.code = data.status;
                    throw apiError;
                }
            }

            console.error(`Error al obtener coordenadas: ${error.message}`, error.response?.data);
            throw error;
        }
    }
}

module.exports = new GeocodingService()