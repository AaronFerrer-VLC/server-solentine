# JSDoc Documentation Guide

Este proyecto utiliza JSDoc para documentar el código. Esta guía explica cómo documentar correctamente.

## Ejemplos de Documentación

### Funciones

```javascript
/**
 * Calcula el total de ventas para un período
 * 
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Promise<Number>} Total de ventas
 * @throws {ValidationError} Si las fechas son inválidas
 * 
 * @example
 * const total = await calculateTotalSales(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 */
async function calculateTotalSales(startDate, endDate) {
  // ...
}
```

### Clases

```javascript
/**
 * Servicio de geocodificación usando Google Maps API
 * 
 * @class GeocodingService
 * @description Proporciona métodos para geocodificar direcciones
 */
class GeocodingService {
  /**
   * Obtiene coordenadas de una dirección
   * 
   * @param {string} address - Dirección a geocodificar
   * @returns {Promise<Object>} Coordenadas {lat, lng}
   */
  async getCoordinates(address) {
    // ...
  }
}
```

### Tipos Personalizados

```javascript
/**
 * @typedef {Object} UserData
 * @property {string} username - Nombre de usuario
 * @property {string} email - Email del usuario
 * @property {'user'|'admin'} role - Rol del usuario
 */

/**
 * Crea un nuevo usuario
 * 
 * @param {UserData} userData - Datos del usuario
 * @returns {Promise<User>} Usuario creado
 */
async function createUser(userData) {
  // ...
}
```

### Módulos

```javascript
/**
 * @fileoverview Authentication Controllers
 * @module controllers/auth
 * @description Maneja la autenticación de usuarios (login, signup, verify)
 */
```

## Etiquetas Comunes

- `@param {Type} name - Description`
- `@returns {Type} Description`
- `@throws {ErrorType} Description`
- `@example` - Ejemplo de uso
- `@description` - Descripción detallada
- `@since` - Versión desde la que existe
- `@deprecated` - Marca como deprecado
- `@see` - Referencia a otra documentación

## Generar Documentación

```bash
# Instalar JSDoc
npm install --save-dev jsdoc

# Generar documentación
npx jsdoc -c jsdoc.config.json
```

