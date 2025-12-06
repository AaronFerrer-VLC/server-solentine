/**
 * Test Setup
 * Configuración global para tests
 */

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.TOKEN_SECRET = 'test-secret-key-for-jwt-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/solentine-test';

// Timeout global para tests
jest.setTimeout(10000);

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

