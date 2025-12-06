/**
 * Mock de Mongoose para tests unitarios
 * Permite testear sin conexión real a MongoDB
 */

const mongoose = require('mongoose');

// Mock de conexión
mongoose.connect = jest.fn(() => Promise.resolve());
mongoose.disconnect = jest.fn(() => Promise.resolve());

module.exports = mongoose;

