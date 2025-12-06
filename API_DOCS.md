# API Documentation

## Base URL

**Production**: `https://server-solentine.fly.dev`  
**Development**: `http://localhost:5005`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST `/api/auth/signup`

Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "familyName": "Doe",
  "role": "user"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Login successful",
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/auth/verify`

Verify JWT token and get user data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "loggedUserData": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Sales

#### GET `/api/sales`

Get paginated list of sales.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 100, max: 1000) - Items per page
- `sortKey` (string) - Field to sort by (Fecha, date, Importe, amount, Año, year, Negocio, business)
- `sortDirection` (string) - Sort direction (asc, desc)
- `year` (number) - Filter by year
- `business` (string) - Filter by business name
- `zone` (ObjectId) - Filter by zone
- `brand` (ObjectId) - Filter by brand
- `client` (ObjectId) - Filter by client
- `comercial` (ObjectId) - Filter by commercial

**Response:** `200 OK`
```json
{
  "sales": [...],
  "totalSales": 100,
  "totalPages": 10
}
```

#### POST `/api/sales`

Create a new sale. **Requires authentication.**

**Request Body:**
```json
{
  "Id": 1,
  "Día": 1,
  "Mes": 1,
  "Año": 2024,
  "Fecha": "01/01/2024",
  "Negocio": "Business Name",
  "Zona": "ObjectId",
  "Marca": "ObjectId",
  "Cliente": "ObjectId",
  "Importe": 1000,
  "Comercial": "ObjectId"
}
```

**Response:** `201 Created`

#### PUT `/api/sales/:id`

Update a sale. **Requires authentication.**

**Response:** `200 OK`

#### DELETE `/api/sales/:id`

Delete a sale. **Requires authentication.**

**Response:** `200 OK`

### Clients

#### GET `/api/clients`

Get all clients.

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "name": "Client Name",
    "email": "client@example.com",
    "address": "123 Main St",
    "position": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
]
```

#### POST `/api/clients`

Create a new client. **Requires authentication.**

**Request Body:**
```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "address": "123 Main St"
}
```

**Response:** `201 Created`

#### PUT `/api/clients/:id`

Update a client. **Requires authentication.**

**Response:** `200 OK`

#### DELETE `/api/clients/:id`

Delete a client. **Requires authentication.**

**Response:** `200 OK`

### Error Responses

All endpoints may return error responses in the following format:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 20 requests per 15 minutes per IP

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Remaining requests
- `RateLimit-Reset`: Time when limit resets

