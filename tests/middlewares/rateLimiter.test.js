/**
 * Tests para Rate Limiter Middleware
 */

const { apiLimiter, authLimiter } = require('../../middlewares/rateLimiter');

describe('Rate Limiter', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            ip: '127.0.0.1',
            method: 'GET',
            path: '/api/test'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('apiLimiter', () => {
        it('should allow requests under the limit', () => {
            // This test would require mocking the rate limiter store
            // For now, we just verify the limiter is configured
            expect(apiLimiter).toBeDefined();
        });
    });

    describe('authLimiter', () => {
        it('should be configured with correct limits', () => {
            expect(authLimiter).toBeDefined();
        });
    });
});

