const express = require("express")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const { apiLimiter } = require("../middlewares/rateLimiter")

const FRONTEND_URL = process.env.ORIGIN || 'https://solentine.netlify.app'

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
        connectSrc: ["'self'", FRONTEND_URL],
      },
    },
    crossOriginEmbedderPolicy: false,
  }))

  // CORS configuration
  app.use(
    cors({
      origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  // Request logging
  app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  // Body parsing with size limits
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())

  // Apply rate limiting to all routes
  app.use('/api/', apiLimiter)
}
