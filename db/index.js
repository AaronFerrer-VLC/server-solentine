const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGODB_URI

if (!MONGO_URI) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    }

    const connection = await mongoose.connect(MONGO_URI, options)
    
    const dbName = connection.connections[0].name
    console.log(`✅ Connected to MongoDB! Database: "${dbName}"`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })

    return connection
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err)
    process.exit(1)
  }
}

// Connect immediately
connectDB()

module.exports = connectDB

