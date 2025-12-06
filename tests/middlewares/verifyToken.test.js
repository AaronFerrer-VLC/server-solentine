/**
 * Tests para verifyToken Middleware
 */

const verifyToken = require('../../middlewares/verifyToken');
const jwt = require('jsonwebtoken');
const User = require('../../models/User.model');
const { AuthenticationError, NotFoundError } = require('../../utils/errors');

jest.mock('jsonwebtoken');
jest.mock('../../models/User.model');

describe('verifyToken Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        
        process.env.TOKEN_SECRET = 'test-secret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should verify token and attach user to request', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            username: 'testuser',
            email: 'test@example.com'
        };

        req.headers.authorization = 'Bearer valid-token';
        jwt.verify.mockReturnValue({ userId: mockUser._id });
        User.findById.mockResolvedValue(mockUser);

        await verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
        expect(User.findById).toHaveBeenCalledWith(mockUser._id);
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalledWith();
    });

    it('should return error if token is missing', async () => {
        req.headers.authorization = undefined;

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
        expect(next.mock.calls[0][0].message).toContain('Token not provided');
    });

    it('should return error if token format is invalid', async () => {
        req.headers.authorization = 'InvalidFormat token';

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should return error if token is invalid', async () => {
        req.headers.authorization = 'Bearer invalid-token';
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });
        jwt.verify.mockReturnValue = jest.fn().mockImplementation(() => {
            const error = new Error('Invalid token');
            error.name = 'JsonWebTokenError';
            throw error;
        });

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return error if user not found', async () => {
        req.headers.authorization = 'Bearer valid-token';
        jwt.verify.mockReturnValue({ userId: '507f1f77bcf86cd799439011' });
        User.findById.mockResolvedValue(null);

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
});

