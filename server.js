const app = require("./app")

const PORT = process.env.PORT || 5005

/**
 * Manejo de errores no capturados
 * IMPORTANTE: Evita que la aplicación se cierre inesperadamente en producción
 */
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION - La aplicación se cerrará:', error)
  console.error('Stack:', error.stack)
  // En producción, es mejor cerrar y dejar que Fly.io reinicie
  // Pero primero logueamos el error para debugging
  setTimeout(() => {
    process.exit(1)
  }, 1000) // Dar tiempo para que se escriban los logs
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION en:', promise)
  console.error('Razón:', reason)
  // NO hacer process.exit() inmediatamente - puede ser un error recuperable
  // Solo loguear para debugging
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
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`)
})

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, closing server gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcing server shutdown after timeout')
    process.exit(1)
  }, 10000)
})
