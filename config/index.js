const express = require("express")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const { apiLimiter } = require("../middlewares/rateLimiter")

/**
 * Parse ORIGIN environment variable to handle multiple URLs
 * Supports comma-separated values: "url1,url2,url3"
 */
const parseOrigins = () => {
  const defaultOrigins = [
    'https://solentine.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  if (!process.env.ORIGIN) {
    return defaultOrigins;
  }

  // Split by comma and trim each URL
  const envOrigins = process.env.ORIGIN
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0);

  // Combine with defaults and remove duplicates
  const allOrigins = [...new Set([...envOrigins, ...defaultOrigins])];
  
  return allOrigins;
};

const ALLOWED_ORIGINS = parseOrigins();

module.exports = (app) => {
  // Trust proxy for rate limiting behind reverse proxy
  app.set("trust proxy", 1)

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...ALLOWED_ORIGINS],
      },
    },
    crossOriginEmbedderPolicy: false,
  }))

  // CORS configuration
  // IMPORTANTE: Esta configuración permite múltiples orígenes
  // Asegúrate de configurar ORIGIN en las variables de entorno de Fly.io
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list
        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          // Log unauthorized origin for debugging
          console.warn(`⚠️  CORS: Origin no permitido: ${origin}`);
          console.log(`Orígenes permitidos:`, ALLOWED_ORIGINS);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 86400 // 24 hours
    })
  )

  // Log allowed origins in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🌐 CORS - Orígenes permitidos:', ALLOWED_ORIGINS);
  }

  // Request logging
  app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  // Body parsing with size limits
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())

  // Apply rate limiting to all routes EXCEPT auth routes
  // Auth routes tienen su propio rate limiter más estricto
  app.use('/api/', (req, res, next) => {
    // Skip rate limiting for auth routes (they have their own limiter)
    if (req.path.startsWith('/auth')) {
      return next();
    }
    apiLimiter(req, res, next);
  })
}
