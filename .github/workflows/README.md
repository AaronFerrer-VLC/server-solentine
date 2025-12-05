# GitHub Actions Workflows - Servidor

Este directorio contiene los workflows de CI/CD para el servidor de Solentine.

## 📋 Workflows Disponibles

### 1. `ci.yml` - Continuous Integration
**Cuándo se ejecuta:**
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Qué hace:**
- Verificación de sintaxis del código
- Verifica que no haya errores de sintaxis en los archivos principales

**No despliega**, solo verifica que el código sea válido.

---

### 2. `deploy.yml` - Despliegue a Fly.io
**Cuándo se ejecuta:**
- Push a `main`
- Manualmente desde GitHub Actions

**Qué hace:**
- Instala dependencias
- Despliega a Fly.io usando `flyctl deploy`
- Verifica el estado del despliegue

**Secrets requeridos:**
- `FLY_API_TOKEN` - Token de API de Fly.io

---

## 🔧 Configuración de Secrets

### Fly.io

1. Instala Fly CLI localmente: `npm install -g @fly/cli`
2. Ejecuta: `fly auth token`
3. Copia el token que se muestra

En GitHub:
1. Ve a tu repositorio → "Settings" → "Secrets and variables" → "Actions"
2. Añade este secret:
   - `FLY_API_TOKEN`: El token que obtuviste

---

## 🚀 Uso

### Despliegue Automático

Una vez configurado el secret, los despliegues se ejecutarán automáticamente cuando:
- Haces push a `main`
- Haces merge de un pull request a `main`

### Despliegue Manual

1. Ve a tu repositorio en GitHub
2. Haz clic en "Actions"
3. Selecciona el workflow "Deploy to Fly.io"
4. Haz clic en "Run workflow"
5. Selecciona la rama y haz clic en "Run workflow"

---

## 📊 Monitoreo

Puedes ver el estado de los workflows en:
- GitHub → "Actions" tab
- Cada workflow muestra el estado (✅ success, ❌ failure, 🟡 in progress)

---

## 🔍 Troubleshooting

### El despliegue falla

1. **Verifica el secret**: Asegúrate de que `FLY_API_TOKEN` esté configurado correctamente
2. **Revisa los logs**: En GitHub Actions, haz clic en el workflow fallido para ver los logs
3. **Verifica permisos**: Asegúrate de que tengas permisos en Fly.io para desplegar la app `server-solentine`
4. **Revisa los logs de Fly.io**: `fly logs --app server-solentine`

### El servidor no se despliega

- Verifica que `FLY_API_TOKEN` esté configurado
- Verifica que tengas permisos en Fly.io para desplegar la app `server-solentine`
- Revisa los logs de Fly.io: `fly logs`

---

## 📝 Notas

- Los workflows se ejecutan en la rama `main` por defecto
- El workflow de CI se ejecuta en cada push/PR para verificar que el código sea válido

