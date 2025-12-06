// Inicializar Sentry ANTES de cualquier otra cosa
const { initSentry } = require('./config/sentry');
initSentry();

const { defaultLogger } = require('./utils/logger');
const app = require("./app")

const PORT = process.env.PORT || 5005
const logger = defaultLogger.child('Server');

/**
 * Manejo de errores no capturados
 * IMPORTANTE: Evita que la aplicación se cierre inesperadamente en producción
 */
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION - La aplicación se cerrará', error, {
    type: 'uncaughtException'
  });
  
  const { captureException } = require('./config/sentry');
  captureException(error, { type: 'uncaughtException' });
  
  // En producción, es mejor cerrar y dejar que Fly.io reinicie
  setTimeout(() => {
    process.exit(1)
  }, 1000) // Dar tiempo para que se escriban los logs
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION', reason, {
    type: 'unhandledRejection',
    promise: promise.toString()
  });
  
  const { captureException } = require('./config/sentry');
  captureException(reason, { type: 'unhandledRejection' });
  
  // NO hacer process.exit() inmediatamente - puede ser un error recuperable
})

// Health check endpoint para Fly.io
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    healthCheck: `http://0.0.0.0:${PORT}/health`
  });
})

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0)
  })
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.warn('Forcing server shutdown after timeout');
    process.exit(1)
  }, 10000)
})
