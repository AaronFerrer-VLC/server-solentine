const axios = require('axios')
const crypto = require('crypto')

const GOOGLE_MAPS_API_BASE_URL = process.env.GOOGLE_MAPS_BASE_URL;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_SECRET = process.env.GOOGLE_MAPS_SECRET;

// Remove the signUrl function as it is no longer needed

class GeocodingService {
    constructor() {
        this.axiosApp = axios.create({
            baseURL: GOOGLE_MAPS_API_BASE_URL
        });
    }

    async getCoordinates(address) {
        try {
            const url = `${GOOGLE_MAPS_API_BASE_URL}?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await this.axiosApp.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener coordenadas: ${error.message}`, error.response?.data);
            throw new Error('No se pudieron obtener las coordenadas');
        }
    }
}

module.exports = new GeocodingService()