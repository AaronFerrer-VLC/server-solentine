const mongoose = require("mongoose")

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
    console.error('❌ MONGODB_URI environment variable is not defined')
    console.error('⚠️  La aplicación continuará pero las operaciones de BD fallarán')
    console.error('💡 Configura MONGODB_URI en Fly.io: fly secrets set MONGODB_URI="tu-uri"')
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
    console.log(`✅ Connected to MongoDB! Database: "${dbName}"`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message)
      // NO hacer process.exit() - permite reconexión
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected - intentando reconectar...')
      // Mongoose intentará reconectar automáticamente
    })

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully')
    })

    mongoose.connection.on('connecting', () => {
      console.log('🔄 Connecting to MongoDB...')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Received SIGINT, closing MongoDB connection...')
      try {
        await mongoose.connection.close()
        console.log('✅ MongoDB connection closed gracefully')
        process.exit(0)
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err)
        process.exit(1)
      }
    })

    process.on('SIGTERM', async () => {
      console.log('🛑 Received SIGTERM, closing MongoDB connection...')
      try {
        await mongoose.connection.close()
        console.log('✅ MongoDB connection closed gracefully')
        process.exit(0)
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err)
        process.exit(1)
      }
    })

    return connection
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message)
    console.error("⚠️  La aplicación continuará ejecutándose")
    console.error("💡 Verifica que MONGODB_URI sea correcta y que MongoDB esté accesible")
    console.error("💡 Mongoose intentará reconectar automáticamente")
    
    // NO hacer process.exit(1) - esto causa reinicios infinitos en Fly.io
    // En su lugar, permitimos que la app inicie y Mongoose intentará reconectar
    return null;
  }
}

// Connect immediately (no bloquea el inicio del servidor)
connectDB().catch(err => {
  console.error('❌ Error inicial al conectar MongoDB:', err.message)
  // NO hacer process.exit() - permite que el servidor inicie
})

module.exports = connectDB

