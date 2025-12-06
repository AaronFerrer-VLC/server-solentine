/**
 * Centralized Error Handling Middleware
 */

const { AppError } = require('../utils/errors');
const { defaultLogger } = require('../utils/logger');
const { captureException } = require('../config/sentry');

const logger = defaultLogger.child('ErrorHandler');

const errorHandler = (err, req, res, next) => {
  // Set default error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error con logger estructurado
  const errorContext = {
    method: req.method,
    path: req.path,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === 'development' && {
      body: req.body,
      params: req.params,
      query: req.query,
      stack: err.stack
    })
  };

  logger.error(err.message, err, errorContext);

  // Enviar a Sentry si no es un error operacional
  if (!err.isOperational && process.env.SENTRY_DSN) {
    captureException(err, {
      request: {
        method: req.method,
        path: req.path,
        headers: req.headers
      },
      user: req.user ? { id: req.user._id } : undefined
    });
  }

  // Operational errors (trusted errors) - Check this BEFORE Mongoose errors
  // This handles custom ValidationError from express-validator
  if (err.isOperational) {
    const statusCode = err.statusCode || 500;
    const responseData = {
      status: 'error',
      message: err.message,
      ...(err.errors && { errors: err.errors })
    };
    logger.warn('Operational error', { 
      name: err.name, 
      message: err.message, 
      statusCode,
      hasErrors: !!err.errors,
      errorsCount: err.errors ? (Array.isArray(err.errors) ? err.errors.length : Object.keys(err.errors).length) : 0
    });
    logger.debug('Sending response', { responseData });
    return res.status(statusCode).json(responseData);
  }

  // Mongoose validation error (only if not operational)
  if (err.name === 'ValidationError' && err.errors && typeof err.errors === 'object' && !Array.isArray(err.errors)) {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      status: 'error',
      message: `${field} already exists`,
      field
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Handle AuthenticationError specifically (should be operational, but double-check)
  if (err.name === 'AuthenticationError') {
    logger.warn('Authentication error', { message: err.message });
    return res.status(401).json({
      status: 'error',
      message: err.message
    });
  }

  // Programming or unknown errors
  // Estos errores se envían a Sentry
  logger.error('Unhandled error', err, {
    name: err.name,
    type: 'unhandled'
  });

  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message || 'Internal server error'
  });
};

module.exports = errorHandler;

