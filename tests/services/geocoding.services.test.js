/**
 * Tests para Geocoding Service
 */

// Mock axios before requiring the service
jest.mock('axios', () => {
    const mockAxiosInstance = {
        get: jest.fn()
    };
    return {
        create: jest.fn(() => mockAxiosInstance),
        default: mockAxiosInstance
    };
});

const axios = require('axios');
const geocodingService = require('../../services/geocoding.services');

describe('Geocoding Service', () => {
    beforeEach(() => {
        process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';
        process.env.GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
        jest.clearAllMocks();
    });

    it('should return coordinates for valid address', async () => {
        const mockResponse = {
            data: {
                status: 'OK',
                results: [{
                    geometry: {
                        location: {
                            lat: 40.7128,
                            lng: -74.0060
                        }
                    }
                }]
            }
        };

        const mockAxiosInstance = axios.create();
        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        
        const result = await geocodingService.getCoordinates('New York, NY');

        expect(result.status).toBe('OK');
        expect(result.results).toHaveLength(1);
    });

    it('should throw error if address is missing', async () => {
        await expect(geocodingService.getCoordinates('')).rejects.toThrow('La dirección es requerida');
    });

    it('should throw error if API key is missing', async () => {
        const originalKey = process.env.GOOGLE_MAPS_API_KEY;
        delete process.env.GOOGLE_MAPS_API_KEY;
        
        // Re-require to get new instance without key
        jest.resetModules();
        const service = require('../../services/geocoding.services');
        
        await expect(service.getCoordinates('New York, NY')).rejects.toThrow('GOOGLE_MAPS_API_KEY');
        
        // Restore
        process.env.GOOGLE_MAPS_API_KEY = originalKey;
    });

    it('should handle REQUEST_DENIED error', async () => {
        const mockResponse = {
            data: {
                status: 'REQUEST_DENIED',
                error_message: 'This API project is not authorized to use this API.'
            }
        };

        const mockAxiosInstance = axios.create();
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        await expect(geocodingService.getCoordinates('New York, NY')).rejects.toThrow();
    });
});

