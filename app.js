require("dotenv").config()
const express = require("express")
const app = express()

// Importar db pero no bloquear - Mongoose manejará la conexión
// Con bufferCommands: true, las queries se encolarán hasta que MongoDB esté listo
require("./db")

require("./config")(app)

// Health check endpoints - DEBEN estar antes de las rutas de la API
// IMPORTANTE: Estos endpoints deben responder rápidamente para que Fly.io sepa que la app está viva
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStates[dbStatus] || 'unknown',
    // La app está saludable incluso si la DB no está conectada (puede reconectar)
    healthy: true
  });
});

// Health check simple para verificar que el servidor responde
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Solentine API is running',
    version: '1.0.0'
  });
});

require("./routes")(app)
require("./error-handling")(app)

module.exports = app
