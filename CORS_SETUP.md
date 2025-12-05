# 🔧 Configuración de CORS para Producción

## Problema Común: Error de CORS en Producción

Si ves este error:
```
Access to XMLHttpRequest at 'https://server-solentine.fly.dev/api/...' 
from origin 'https://solentine.netlify.app' has been blocked by CORS policy
```

## ✅ Solución: Configurar ORIGIN en Fly.io

### Opción 1: Usando Fly CLI

```bash
# Desde la carpeta server-solentine
fly secrets set ORIGIN="https://solentine.netlify.app,http://localhost:5173"
```

### Opción 2: Desde el Dashboard de Fly.io

1. Ve a [Fly.io Dashboard](https://fly.io/dashboard)
2. Selecciona tu app `server-solentine`
3. Ve a "Secrets"
4. Añade o edita la variable `ORIGIN`
5. Valor: `https://solentine.netlify.app,http://localhost:5173`
6. Guarda los cambios

### Opción 3: Usando fly.toml (no recomendado para secrets)

No uses `fly.toml` para secrets sensibles. Usa `fly secrets set` en su lugar.

## 🔍 Verificar Configuración

Después de configurar, verifica que el servidor esté usando los orígenes correctos:

1. Reinicia la aplicación:
   ```bash
   fly deploy
   ```

2. Revisa los logs:
   ```bash
   fly logs
   ```

3. En desarrollo, deberías ver:
   ```
   🌐 CORS - Orígenes permitidos: [ 'https://solentine.netlify.app', 'http://localhost:5173', ... ]
   ```

## 📝 Formato de ORIGIN

El valor de `ORIGIN` puede ser:
- Una sola URL: `https://solentine.netlify.app`
- Múltiples URLs separadas por comas: `https://solentine.netlify.app,http://localhost:5173`

**Importante**: No uses espacios alrededor de las comas en producción.

## 🐛 Troubleshooting

### El error persiste después de configurar ORIGIN

1. **Verifica que el secret esté configurado**:
   ```bash
   fly secrets list
   ```

2. **Reinicia la aplicación**:
   ```bash
   fly deploy
   ```

3. **Verifica los logs** para ver qué orígenes están permitidos:
   ```bash
   fly logs | grep CORS
   ```

4. **Verifica que la URL del frontend coincida exactamente**:
   - Debe incluir el protocolo (`https://`)
   - No debe terminar en `/`
   - Debe coincidir exactamente con la URL del navegador

### Ejemplo de URLs correctas vs incorrectas

✅ **Correctas**:
- `https://solentine.netlify.app`
- `https://solentine.netlify.app,http://localhost:5173`

❌ **Incorrectas**:
- `solentine.netlify.app` (falta protocolo)
- `https://solentine.netlify.app/` (barra final)
- `https://solentine.netlify.app , http://localhost:5173` (espacios)

## 🔐 Seguridad

- **NO** uses `*` como origen en producción
- **SÍ** lista explícitamente los orígenes permitidos
- **SÍ** incluye solo los orígenes que realmente necesitas
- **SÍ** usa HTTPS en producción

## 📚 Referencias

- [Fly.io Secrets Documentation](https://fly.io/docs/reference/secrets/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

