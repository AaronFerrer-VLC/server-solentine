const axios = require('axios')
const signUrl = require('../utils/signUrl')

const GOOGLE_MAPS_API_BASE_URL = process.env.GOOGLE_MAPS_BASE_URL || 'https://maps.googleapis.com/maps/api'
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_SECRET = process.env.GOOGLE_MAPS_SECRET

class GeocodingService {
    constructor() {
        this.axiosApp = axios.create({
            baseURL: GOOGLE_MAPS_API_BASE_URL
        })
    }

    async getCoordinates(address) {
        try {
            const url = `${GOOGLE_MAPS_API_BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
            const signedUrl = `${url}&signature=${signUrl(url, GOOGLE_MAPS_SECRET)}`;
            const response = await this.axiosApp.get(signedUrl);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener coordenadas: ${error.message}`);
            throw new Error('No se pudieron obtener las coordenadas');
        }
    }
}

module.exports = new GeocodingService()