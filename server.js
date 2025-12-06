// Inicializar Sentry ANTES de cualquier otra cosa
const { initSentry } = require('./config/sentry');
initSentry();

const { defaultLogger } = require('./utils/logger');
const app = require("./app")

const PORT = process.env.PORT || 5005
const logger = defaultLogger.child('Server');

/**
 * Manejo de errores no capturados
 * IMPORTANTE: En Fly.io, NO hacer exit inmediatamente para evitar loops de reinicio
 */
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION', error, {
    type: 'uncaughtException',
    message: error.message,
    stack: error.stack
  });
  
  const { captureException } = require('./config/sentry');
  captureException(error, { type: 'uncaughtException' });
  
  // En Fly.io, NO hacer exit inmediatamente - esto causa loops de reinicio
  // Fly.io detectará que el proceso no está respondiendo y lo reiniciará
  // Solo hacer exit para errores realmente críticos después de un delay
  if (error.code === 'EADDRINUSE' || error.message.includes('port')) {
    setTimeout(() => {
      logger.error('Critical error - exiting', error);
      process.exit(1);
    }, 2000);
  }
  // Para otros errores, solo loguear y continuar
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

// Iniciar servidor con manejo de errores
let server;
try {
  server = app.listen(PORT, '0.0.0.0', () => {
    logger.info('Server started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      healthCheck: `http://0.0.0.0:${PORT}/health`
    });
  });

  // Manejo de errores del servidor
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use`, error);
      process.exit(1);
    } else {
      logger.error('Server error', error);
      // NO hacer exit() para otros errores - permite que Fly.io maneje el reinicio
    }
  });
} catch (error) {
  logger.error('Failed to start server', error);
  // Solo hacer exit si es un error crítico de inicio
  if (error.code === 'EADDRINUSE') {
    process.exit(1);
  }
  // Para otros errores, lanzar pero no hacer exit - permite logging
  throw error;
}

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
