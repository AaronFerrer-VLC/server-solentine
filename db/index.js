const mongoose = require("mongoose")
const { defaultLogger } = require('../utils/logger')

const logger = defaultLogger.child('Database')

const MONGO_URI = process.env.MONGODB_URI

/**
 * MongoDB Connection Handler
 * 
 * IMPORTANTE: No usa process.exit() para evitar reinicios en Fly.io
 * En su lugar, implementa reconexión automática y manejo graceful de errores
 */
const connectDB = async () => {
  // Verificar que MONGODB_URI esté configurada
  if (!MONGO_URI) {
    logger.error('MONGODB_URI environment variable is not defined', null, {
      action: 'database_connection',
      status: 'failed'
    });
    // NO hacer process.exit() - permite que la app inicie y muestre el error
    return null;
  }

  try {
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Aumentado a 10 segundos para dar más tiempo
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // IMPORTANTE: bufferCommands debe ser true para que las queries se encolen
      // hasta que la conexión esté lista. Si es false, las queries fallan si
      // se ejecutan antes de que MongoDB se conecte.
      bufferCommands: true, // Enable buffering - queries se encolan hasta conexión
      retryWrites: true,
      retryReads: true,
    }

    const connection = await mongoose.connect(MONGO_URI, options)
    
    const dbName = connection.connections[0].name
    logger.info('Connected to MongoDB', { database: dbName })

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', err, { action: 'database_connection' })
      // NO hacer process.exit() - permite reconexión
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected - intentando reconectar...', { action: 'database_reconnection' })
      // Mongoose intentará reconectar automáticamente
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully', { action: 'database_reconnection' })
    })

    mongoose.connection.on('connecting', () => {
      logger.debug('Connecting to MongoDB...', { action: 'database_connection' })
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, closing MongoDB connection...', { action: 'shutdown' })
      try {
        await mongoose.connection.close()
        logger.info('MongoDB connection closed gracefully', { action: 'shutdown' })
        process.exit(0)
      } catch (err) {
        logger.error('Error closing MongoDB connection', err, { action: 'shutdown' })
        process.exit(1)
      }
    })

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, closing MongoDB connection...', { action: 'shutdown' })
      try {
        await mongoose.connection.close()
        logger.info('MongoDB connection closed gracefully', { action: 'shutdown' })
        process.exit(0)
      } catch (err) {
        logger.error('Error closing MongoDB connection', err, { action: 'shutdown' })
        process.exit(1)
      }
    })

    return connection
  } catch (err) {
    logger.error('Error connecting to MongoDB', err, {
      action: 'database_connection',
      status: 'failed',
      willRetry: true
    })
    
    // NO hacer process.exit(1) - esto causa reinicios infinitos en Fly.io
    // En su lugar, permitimos que la app inicie y Mongoose intentará reconectar
    return null;
  }
}

// Connect immediately (no bloquea el inicio del servidor)
connectDB().catch(err => {
  logger.error('Error inicial al conectar MongoDB', err, { action: 'database_initial_connection' })
  // NO hacer process.exit() - permite que el servidor inicie
})

module.exports = connectDB

