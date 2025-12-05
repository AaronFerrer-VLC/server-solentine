/**
 * Rate Limiting Middleware
 * Prevents abuse and brute force attacks
 */

const rateLimit = require('express-rate-limit');

// General API rate limiter
// Aplicado a todas las rutas /api/ excepto auth (que tiene su propio limiter)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Has excedido el límite de peticiones. Por favor, espera un momento antes de intentar de nuevo.',
    retryAfter: 15
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  // Añadir información útil en los headers
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiter for auth endpoints
// Más permisivo para evitar bloquear usuarios legítimos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs (aumentado de 5)
  message: {
    error: 'Too many authentication attempts',
    message: 'Has excedido el límite de intentos de autenticación. Por favor, espera 15 minutos antes de intentar de nuevo.',
    retryAfter: 15
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  // Añadir información útil en los headers
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  strictLimiter
};

