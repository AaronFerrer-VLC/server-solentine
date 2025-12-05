# Solentine Server - Backend API

API RESTful desarrollada con Express.js para el sistema de gestión de ventas Solentine. Arquitectura moderna, segura y escalable con las mejores prácticas de la industria.

## 🚀 Características

- ✅ **API RESTful** completa con Express.js
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Autorización por roles** (user/admin)
- ✅ **Validación robusta** con express-validator
- ✅ **Seguridad avanzada** (Helmet, Rate Limiting, CORS)
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **Geocodificación** con Google Maps API
- ✅ **Almacenamiento de imágenes** con Cloudinary
- ✅ **Manejo centralizado de errores**
- ✅ **Logging** con Morgan
- ✅ **Optimización de queries** con índices

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **MongoDB** (local o Atlas)
- **Cuenta de Cloudinary** (para imágenes)
- **Cuenta de Google Maps API** (para geocodificación)

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env (ver sección de configuración)
cp .env.example .env

# Editar .env con tus credenciales
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Server
PORT=5005
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/solentine

# JWT
TOKEN_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=6h

# CORS
ORIGIN=http://localhost:5173,https://solentine.netlify.app

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret

# Google Maps
GOOGLE_MAPS_BASE_URL=https://maps.googleapis.com/maps/api
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_MAPS_SECRET=your-google-maps-secret
```

> 📋 Para más detalles sobre las variables de entorno, consulta el archivo `ENV_VARIABLES.md` en la raíz del proyecto.

## 🚀 Ejecución

### Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:5005` (o el puerto configurado en `.env`)

### Producción

```bash
npm start
```

## 📁 Estructura del Proyecto

```
server-solentine/
├── config/                  # Configuración de Express
│   └── index.js            # CORS, Helmet, Body Parser, Rate Limiting
├── controllers/            # Controladores de rutas
│   ├── auth.controllers.js
│   ├── client.controllers.js
│   ├── comercial.controllers.js
│   ├── sale.controllers.js
│   ├── user.controllers.js
│   ├── zone.controllers.js
│   └── brand.controllers.js
├── db/                     # Conexión a MongoDB
│   └── index.js           # Configuración optimizada con reconexión
├── error-handling/        # Manejo centralizado de errores
│   └── index.js           # Middleware de errores
├── middlewares/           # Middlewares personalizados
│   ├── errorHandler.js    # Manejo avanzado de errores
│   ├── rateLimiter.js    # Rate limiting configurado
│   ├── validateRole.js   # Autorización por roles
│   ├── verifyToken.js    # Verificación JWT
│   └── uplaoder.middleware.js # Upload a Cloudinary
├── models/                # Modelos de Mongoose
│   ├── User.model.js     # Usuario con índices optimizados
│   ├── Client.model.js
│   ├── Sale.model.js
│   ├── Comercial.model.js
│   ├── Zone.model.js
│   └── Brand.model.js
├── routes/                # Definición de rutas
│   ├── index.js          # Router principal
│   ├── auth.routes.js
│   ├── client.routes.js
│   ├── sale.routes.js
│   ├── user.routes.js
│   ├── comercial.routes.js
│   ├── zone.routes.js
│   ├── brand.routes.js
│   ├── geocoding.routes.js
│   ├── upload.routes.js
│   └── roles.routes.js
├── services/              # Servicios de negocio
│   └── geocoding.services.js
├── utils/                 # Utilidades
│   └── errors.js         # Clases de error personalizadas
├── validators/            # Validadores de entrada
│   └── auth.validators.js
├── app.js                 # Configuración de Express
├── server.js              # Inicio del servidor
├── Dockerfile             # Para despliegue con Docker
├── fly.toml              # Configuración Fly.io
├── .env                  # Variables de entorno (no versionado)
├── .env.example          # Plantilla de variables
└── package.json
```

## 📝 API Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| `POST` | `/signup` | Registro de nuevo usuario | No | 5/15min |
| `POST` | `/login` | Inicio de sesión | No | 5/15min |
| `GET` | `/verify` | Verificar token y obtener usuario | Sí | 100/15min |

**Ejemplo de registro:**
```json
POST /api/auth/signup
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "Password123",
  "firstName": "Juan",
  "familyName": "Pérez"
}
```

**Ejemplo de login:**
```json
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "Password123"
}
```

### 💰 Ventas (`/api/sales`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Listar ventas (paginación y filtros) | Sí |
| `POST` | `/` | Crear nueva venta | Sí |
| `PUT` | `/:id` | Actualizar venta | Sí |
| `DELETE` | `/:id` | Eliminar venta | Sí |

### 👥 Clientes (`/api/clients`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Listar todos los clientes | Sí |
| `GET` | `/:name` | Obtener cliente por nombre | Sí |
| `POST` | `/` | Crear cliente (con geocodificación) | Sí |
| `PUT` | `/:id` | Actualizar cliente | Sí |
| `DELETE` | `/:id` | Eliminar cliente | Sí |

**Ejemplo de creación de cliente:**
```json
POST /api/clients
{
  "name": "Cliente S.A.",
  "email": "cliente@example.com",
  "address": "Calle Principal 123, Madrid, España"
}
```

### 🏢 Comerciales (`/api/comercials`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Listar comerciales | Sí |
| `POST` | `/` | Crear comercial | Sí |
| `PUT` | `/:id` | Actualizar comercial | Sí |
| `DELETE` | `/:id` | Eliminar comercial | Sí |

### 👤 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| `GET` | `/` | Listar usuarios (paginado) | Sí | - |
| `GET` | `/:id` | Obtener usuario por ID | Sí | - |
| `PUT` | `/:id` | Actualizar usuario | Sí | - |
| `DELETE` | `/:id` | Eliminar usuario | Sí | Admin |

### 🗺️ Geocodificación (`/api/geocoding`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/coordinates?address=...` | Obtener coordenadas | Sí |
| `GET` | `/apikey` | Obtener API key de Google Maps | Sí |

### 📤 Upload (`/api/upload`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/` | Subir imagen a Cloudinary | Sí |

**Formato:**
- Content-Type: `multipart/form-data`
- Campo: `imageData`
- Tamaño máximo: 10MB

### 🏷️ Marcas (`/api/brands`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Listar marcas | Sí |
| `POST` | `/` | Crear marca | Sí |
| `PUT` | `/:id` | Actualizar marca | Sí |
| `DELETE` | `/:id` | Eliminar marca | Sí |

### 🌍 Zonas (`/api/zones`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Listar zonas | Sí |
| `POST` | `/` | Crear zona (con geocodificación) | Sí |
| `PUT` | `/:id` | Actualizar zona | Sí |
| `DELETE` | `/:id` | Eliminar zona | Sí |

### 👥 Roles (`/api/roles`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Listar roles disponibles | Sí |

> 💡 **Nota**: Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`

## 🔒 Seguridad

### Implementaciones

1. **Helmet**: Headers de seguridad HTTP configurados
2. **Rate Limiting**:
   - General: 100 requests/15min por IP
   - Auth endpoints: 5 requests/15min por IP
3. **CORS**: Configuración restrictiva con múltiples orígenes
4. **JWT**: Tokens con expiración configurable
5. **Bcrypt**: Hashing de contraseñas (10 salt rounds)
6. **Validación**: Express-validator con sanitización
7. **Manejo de Errores**: No expone información sensible

### Autenticación

Los tokens JWT se envían en el header:
```
Authorization: Bearer <token>
```

### Autorización

Algunos endpoints requieren roles específicos. Usa el middleware `requireAdmin` o `requireRole`:

```javascript
const { requireAdmin } = require('../middlewares/validateRole');

router.delete('/:id', verifyToken, requireAdmin, deleteUser);
```

## 🗄️ Base de Datos

### Modelos

- **User**: Usuarios del sistema
- **Client**: Clientes
- **Sale**: Ventas
- **Comercial**: Comerciales
- **Zone**: Zonas geográficas
- **Brand**: Marcas de productos

### Índices Optimizados

Los modelos incluyen índices para mejorar el rendimiento:
- `User`: email, username, role, isActive
- Queries frecuentes optimizadas con índices compuestos

### Conexión

La conexión a MongoDB está optimizada con:
- Pool de conexiones (max 10)
- Timeout configurado
- Reconexión automática
- Manejo de errores

## 🛠️ Middlewares

### Personalizados

- **verifyToken**: Verifica y valida tokens JWT
- **validateRole**: Autorización por roles
- **errorHandler**: Manejo centralizado de errores
- **rateLimiter**: Rate limiting configurado

### Validación

- **auth.validators**: Validación de signup y login
- Express-validator con sanitización automática

## 📦 Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **jsonwebtoken**: Autenticación JWT
- **bcryptjs**: Hashing de contraseñas
- **helmet**: Seguridad HTTP
- **express-rate-limit**: Rate limiting
- **express-validator**: Validación de entrada
- **cloudinary**: Almacenamiento de imágenes
- **@googlemaps/google-maps-services-js**: Geocodificación
- **morgan**: Logging HTTP
- **multer**: Upload de archivos

## 🚀 Despliegue

### Fly.io

El proyecto está configurado para desplegarse en Fly.io:

```bash
# Instalar Fly CLI
npm install -g @fly/cli

# Login
fly auth login

# Desplegar
fly deploy
```

### Docker

```bash
# Construir imagen
docker build -t solentine-server .

# Ejecutar contenedor
docker run -p 5005:5005 --env-file .env solentine-server
```

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables de entorno en tu plataforma de despliegue:
- MongoDB URI
- JWT Secret
- Cloudinary credentials
- Google Maps API Key
- CORS Origin

## 🧪 Testing

```bash
# Cuando estén implementados los tests
npm test
```

## 📊 Logging

El servidor usa **Morgan** para logging HTTP:
- **Development**: Formato 'dev'
- **Production**: Formato 'combined'

Los errores se registran con información contextual sin exponer datos sensibles.

## 🐛 Troubleshooting

### Error de conexión a MongoDB

```bash
# Verifica que MongoDB esté corriendo
mongosh

# Revisa la URI en .env
# Para Atlas, asegúrate de que tu IP esté permitida
```

### Error de CORS

```bash
# Verifica que ORIGIN en .env incluya la URL del frontend
ORIGIN=http://localhost:5173,https://tu-dominio.com
```

### Error de autenticación

```bash
# Verifica que TOKEN_SECRET esté configurado
# Genera un nuevo secreto seguro:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Imágenes no se suben

```bash
# Verifica credenciales de Cloudinary
# Revisa el tamaño del archivo (máx 10MB)
```

## 📚 Documentación Adicional

- Consulta `ENV_VARIABLES.md` en la raíz del proyecto para detalles completos de variables de entorno
- Revisa el README principal del proyecto para información general

## 🤝 Contribución

1. Crea una rama para tu feature
2. Implementa tus cambios
3. Asegúrate de que el código pase las validaciones
4. Crea un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👥 Autores

Equipo de desarrollo Solentine

