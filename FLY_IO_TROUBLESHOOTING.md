# 🐛 Troubleshooting - Reinicios en Fly.io

## Problema: La aplicación se reinicia constantemente

Si Fly Doctor te indica que las máquinas se reinician muy a menudo, sigue estos pasos:

## 1. 📋 Revisar Logs

### Desde el Dashboard de Fly.io

1. Ve a tu app en [Fly.io Dashboard](https://fly.io/dashboard)
2. Haz clic en "Logs"
3. Busca errores justo antes de cada reinicio:
   - `Error connecting to MongoDB`
   - `MONGODB_URI environment variable is not defined`
   - `UNCAUGHT EXCEPTION`
   - `UNHANDLED REJECTION`
   - `killed` o `out of memory`

### Desde CLI

```bash
cd server-solentine
fly logs
```

Busca patrones como:
- Errores de MongoDB
- Variables de entorno faltantes
- Errores de memoria
- Excepciones no capturadas

## 2. ✅ Verificar Variables de Entorno

### Listar secrets configurados

```bash
fly secrets list
```

### Variables Requeridas

Asegúrate de que estas variables estén configuradas:

- ✅ `MONGODB_URI` - **CRÍTICA** - Si falta, la app puede crashear
- ✅ `TOKEN_SECRET` - **CRÍTICA** - Necesaria para JWT
- ✅ `ORIGIN` - Para CORS
- ✅ `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` - Para uploads
- ✅ `GOOGLE_MAPS_API_KEY` - Para geocodificación
- ✅ `NODE_ENV` - Recomendado: `production`

### Configurar secrets faltantes

```bash
# MongoDB (CRÍTICO)
fly secrets set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/solentine"

# JWT Secret (CRÍTICO)
fly secrets set TOKEN_SECRET="tu-secreto-super-seguro-minimo-64-caracteres"

# CORS
fly secrets set ORIGIN="https://solentine.netlify.app,http://localhost:5173"

# Cloudinary
fly secrets set CLOUDINARY_NAME="tu-cloudinary-name"
fly secrets set CLOUDINARY_KEY="tu-key"
fly secrets set CLOUDINARY_SECRET="tu-secret"

# Google Maps
fly secrets set GOOGLE_MAPS_API_KEY="tu-api-key"
fly secrets set GOOGLE_MAPS_BASE_URL="https://maps.googleapis.com/maps/api"

# Environment
fly secrets set NODE_ENV="production"
```

## 3. 🔍 Problemas Comunes y Soluciones

### Problema: Error de MongoDB

**Síntomas:**
```
❌ Error connecting to MongoDB: ...
❌ MONGODB_URI environment variable is not defined
```

**Solución:**
1. Verifica que `MONGODB_URI` esté configurada:
   ```bash
   fly secrets list | grep MONGODB_URI
   ```

2. Si no está, configúrala:
   ```bash
   fly secrets set MONGODB_URI="tu-uri-completa"
   ```

3. Verifica que la URI sea correcta:
   - Debe incluir el protocolo: `mongodb+srv://` o `mongodb://`
   - Debe incluir credenciales si es necesario
   - Debe incluir el nombre de la base de datos

4. Si usas MongoDB Atlas:
   - Verifica que tu IP esté en la whitelist (o usa 0.0.0.0/0)
   - Verifica que el usuario tenga permisos

### Problema: Out of Memory

**Síntomas:**
```
killed
out of memory
```

**Solución:**
1. Aumenta la memoria de la VM:
   ```bash
   fly scale vm memory 2048
   ```

2. O edita `fly.toml`:
   ```toml
   [[vm]]
     memory = '2gb'  # Aumentar de 1gb a 2gb
   ```

3. Luego despliega:
   ```bash
   fly deploy
   ```

### Problema: Variables de Entorno Faltantes

**Síntomas:**
```
❌ ... environment variable is not defined
```

**Solución:**
1. Revisa qué variables necesita tu app (ver `ENV_VARIABLES.md`)
2. Configura todas las variables requeridas con `fly secrets set`
3. Reinicia la app:
   ```bash
   fly deploy
   ```

### Problema: Puerto Incorrecto

**Síntomas:**
```
Error: listen EADDRINUSE: address already in use
```

**Solución:**
1. Verifica que `fly.toml` tenga el puerto correcto:
   ```toml
   [http_service]
     internal_port = 5005
   ```

2. Verifica que `PORT` en secrets sea el mismo:
   ```bash
   fly secrets set PORT=5005
   ```

## 4. 🧪 Verificar Health Check

El servidor ahora incluye un endpoint de health check:

```bash
curl https://server-solentine.fly.dev/health
```

Debería responder:
```json
{
  "status": "ok",
  "timestamp": "2025-01-16T...",
  "uptime": 123.45
}
```

Si no responde, hay un problema con el servidor.

## 5. 📊 Monitoreo

### Ver estado de las máquinas

```bash
fly status
```

### Ver logs en tiempo real

```bash
fly logs
```

### Ver logs de una máquina específica

```bash
fly logs --instance <machine-id>
```

## 6. 🔧 Mejoras Implementadas

El código ahora incluye:

- ✅ **No usa `process.exit(1)` en errores de MongoDB** - Evita reinicios infinitos
- ✅ **Manejo de `uncaughtException`** - Logs errores antes de cerrar
- ✅ **Manejo de `unhandledRejection`** - Logs promesas rechazadas
- ✅ **Health check endpoint** - Para monitoreo
- ✅ **Reconexión automática de MongoDB** - Mongoose maneja reconexiones
- ✅ **Graceful shutdown** - Cierra conexiones correctamente

## 7. ✅ Checklist de Verificación

Antes de desplegar, verifica:

- [ ] Todas las variables de entorno están configuradas en Fly.io
- [ ] `MONGODB_URI` es correcta y accesible
- [ ] `TOKEN_SECRET` está configurado
- [ ] `ORIGIN` incluye el dominio de producción
- [ ] La memoria de la VM es suficiente (mínimo 1GB)
- [ ] El puerto en `fly.toml` coincide con `PORT` en secrets
- [ ] Los logs no muestran errores críticos

## 8. 🚀 Despliegue Seguro

Después de verificar todo:

```bash
cd server-solentine
fly deploy
```

Monitorea los logs:

```bash
fly logs
```

Deberías ver:
```
✅ Connected to MongoDB! Database: "..."
✅ Server is running on http://0.0.0.0:5005
```

## 9. 📞 Si el Problema Persiste

1. **Revisa los logs completos**:
   ```bash
   fly logs --instance <machine-id> > logs.txt
   ```

2. **Verifica el estado de la máquina**:
   ```bash
   fly status
   ```

3. **Revisa la configuración**:
   ```bash
   fly config show
   ```

4. **Consulta la documentación de Fly.io**:
   - [Fly.io Docs](https://fly.io/docs/)
   - [Troubleshooting](https://fly.io/docs/app-guides/troubleshooting/)

## 🔗 Recursos

- [Fly.io Status Page](https://status.fly.io/)
- [Fly.io Community](https://community.fly.io/)
- [MongoDB Atlas Connection Issues](https://www.mongodb.com/docs/atlas/troubleshoot-connection/)

