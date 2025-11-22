# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar SPOT (frontend + backend) en Vercel.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Proyecto conectado a un repositorio Git (GitHub, GitLab, Bitbucket)
3. Variables de entorno configuradas

## 🏗️ Estructura del Proyecto

El proyecto tiene dos partes principales:

- **Frontend**: React + Vite en `blockotitos/`
- **Backend**: Express.js en `blockotitos/backend/` (convertido a Serverless Functions en `api/`)

## ⚙️ Configuración

### 1. Variables de Entorno

Configura las siguientes variables de entorno en Vercel Dashboard → Settings → Environment Variables:

#### Backend (API) - Variables Requeridas
```
PORT=4000
RPC_URL=https://soroban-testnet.stellar.org
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
ADMIN_SECRET=SBK5VSQDTBWV6DFIL4RQFQIEIKV4EIBPNPARZ5FGJP6VWQHUQI4RER7W
CLAIM_PAYER_SECRET=SBK5VSQDTBWV6DFIL4RQFQIEIKV4EIBPNPARZ5FGJP6VWQHUQI4RER7W
SPOT_CONTRACT_ID=CC3XATHZKTV7WGEBR337JAH3UTAMQTK7VPPSDSAKHA4KGVOCJPF6P3VF
MOCK_MODE=false
LOG_FILE=backend/logs/backend.log
```

#### Backend (API) - Variables Opcionales
```
CORS_ORIGIN=*
ASSET_BASE_URL=https://tu-dominio.vercel.app
UPLOAD_MAX_BYTES=5242880
```

#### Frontend - Variables Requeridas
```
VITE_BACKEND_URL=https://tu-dominio.vercel.app
VITE_SPOT_CONTRACT_ID=CC3XATHZKTV7WGEBR337JAH3UTAMQTK7VPPSDSAKHA4KGVOCJPF6P3VF
```

**⚠️ IMPORTANTE**: 
- Reemplaza `https://tu-dominio.vercel.app` con tu URL real de Vercel después del primer despliegue
- Las claves secretas (`ADMIN_SECRET`, `CLAIM_PAYER_SECRET`) deben ser las de producción, no las de ejemplo
- `SPOT_CONTRACT_ID` debe ser el ID del contrato desplegado en la red que estés usando

### 2. Configuración de Vercel

El proyecto ya incluye `vercel.json` configurado. Asegúrate de que:

- **Root Directory**: `blockotitos`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install && cd backend && npm install`

## 📦 Pasos para Desplegar

### Opción 1: Despliegue desde Vercel Dashboard

1. **Conectar Repositorio**:
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click en "Add New Project"
   - Conecta tu repositorio de Git

2. **Configurar Proyecto**:
   - **Root Directory**: Selecciona `blockotitos`
   - **Framework Preset**: Vite (o detecta automáticamente)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Variables de Entorno**:
   - Agrega todas las variables de entorno listadas arriba
   - Puedes hacerlo antes o después del primer deploy
   - **Nota**: Después del primer deploy, actualiza `VITE_BACKEND_URL` y `ASSET_BASE_URL` con tu URL real

4. **Desplegar**:
   - Click en "Deploy"
   - Espera a que termine el build

5. **Actualizar Variables** (después del primer deploy):
   - Ve a Settings → Environment Variables
   - Actualiza `VITE_BACKEND_URL` con tu URL de Vercel (ej: `https://tu-proyecto.vercel.app`)
   - Actualiza `ASSET_BASE_URL` con la misma URL
   - Haz un nuevo deploy

### Opción 2: Despliegue desde CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Navegar al directorio del proyecto
cd commitsPre/blockotitos

# 3. Iniciar sesión en Vercel
vercel login

# 4. Desplegar (primera vez)
vercel

# 5. Configurar variables de entorno
vercel env add RPC_URL
vercel env add NETWORK_PASSPHRASE
vercel env add ADMIN_SECRET
# ... (repetir para cada variable)

# 6. Desplegar a producción
vercel --prod
```

## 🔧 Configuración Detallada

### Estructura de Rutas

- **Frontend**: Todas las rutas excepto `/api/*` se sirven desde `dist/`
- **Backend API**: Todas las rutas `/api/*` se enrutan a `api/index.js` (Serverless Function)

### Endpoints del Backend

El backend expone los siguientes endpoints:

- `GET /api/health` - Health check
- `POST /api/creators/approve` - Aprobar creador
- `POST /api/creators/revoke` - Revocar aprobación
- `POST /api/events/create` - Crear evento (con upload de imagen)
- `GET /api/events/:eventId/minted-count` - Contar SPOTs minteados
- `POST /api/events/claim` - Reclamar SPOT
- `GET /api/contract/admin` - Obtener admin del contrato
- `GET /api/contract/event-count` - Contar eventos
- `GET /api/events/onchain` - Listar eventos on-chain

### Uploads de Archivos

⚠️ **Importante**: Vercel Serverless Functions tienen limitaciones para almacenamiento de archivos:

- **Opción 1**: Usar un servicio externo (recomendado)
  - Subir imágenes a Cloudinary, AWS S3, o similar
  - Actualizar el código para usar URLs externas

- **Opción 2**: Usar Vercel Blob Storage (si está disponible)
  - Requiere configuración adicional

- **Opción 3**: Limitar tamaño y usar memoria temporal
  - Solo para archivos pequeños (< 4.5MB)
  - Los archivos se pierden después de la ejecución

## 🔍 Verificación Post-Despliegue

1. **Frontend**:
   ```bash
   curl https://tu-dominio.vercel.app
   ```

2. **Backend Health Check**:
   ```bash
   curl https://tu-dominio.vercel.app/api/health
   ```

3. **Verificar Variables de Entorno**:
   - Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
   - Verifica que todas las variables estén configuradas

## 🐛 Troubleshooting

### Error: "Module not found"
- **Solución**: Asegúrate de que `installCommand` en `vercel.json` instale dependencias del backend

### Error: "Function timeout"
- **Solución**: Aumenta `maxDuration` en `vercel.json` (máximo 60s en plan Hobby)

### Error: "CORS"
- **Solución**: Verifica que `CORS_ORIGIN` esté configurado correctamente

### Backend no responde
- **Solución**: Verifica que las rutas en `api/index.js` estén correctamente exportadas

### Variables de entorno no funcionan
- **Solución**: Asegúrate de que las variables empiecen con `VITE_` para el frontend
- Las variables del backend no necesitan prefijo

## 📝 Notas Importantes

1. **Archivos Estáticos**: Los archivos en `public/` se sirven automáticamente
2. **Build Time**: El build puede tardar varios minutos la primera vez
3. **Cold Start**: Las Serverless Functions pueden tener un "cold start" de 1-2 segundos
4. **Límites**: Plan Hobby tiene límites de tiempo de ejecución y ancho de banda
5. **Secrets**: Nunca commitees las claves secretas al repositorio. Usa siempre variables de entorno.

## 🔗 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

**Última actualización**: Noviembre 2025
