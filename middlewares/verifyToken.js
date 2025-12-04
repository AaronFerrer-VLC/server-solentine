const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AuthenticationError, NotFoundError } = require('../utils/errors');

/**
 * Verify JWT Token Middleware
 * Validates token and attaches user to request object
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AuthenticationError('Token not provided'));
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(new AuthenticationError('Token not provided'));
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return next(new NotFoundError('User'));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AuthenticationError('Invalid token'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AuthenticationError('Token expired'));
        }
        next(error);
    }
};

module.exports = verifyToken;