# Tech Stack - POAP Stellar

## Resumen Ejecutivo

Sistema de POAPs (Proof of Attendance Protocol) construido sobre Stellar Blockchain usando Soroban Smart Contracts, con frontend React/Next.js y backend Firebase.

## Stack Tecnológico

### Blockchain Layer

#### **Blockchain Network**
- **Red Principal**: Stellar Network (Futurenet para pruebas, Mainnet para producción)
- **Smart Contracts Platform**: Soroban (Smart Contract Runtime de Stellar)
- **Lenguaje de Contratos**: Rust
- **SDK**: Soroban SDK v23.0.3+
- **Estándar de NFTs**: SEP-41 (Stellar Enhancement Proposal 41)

#### **Librerías de Contratos**
- `stellar-tokens`: Librería oficial para tokens NFT en Stellar
  - `non_fungible`: Funcionalidades base de NFT
  - `burnable`: Capacidad de quemar NFTs
  - `enumerable`: Enumeración de tokens
- `soroban-sdk`: SDK base de Soroban
- `stellar-access`: Control de acceso y roles
- `stellar-macros`: Macros para simplificar código

#### **Contratos Inteligentes**
1. **Factory Contract**
   - Crea instancias de eventos
   - Gestiona lista de eventos activos
   - Validación de planes y pagos

2. **Event Contract** (Template)
   - Lógica de mint de POAPs
   - Control de permisos (Owner, Admin, Minter, Viewer)
   - Validación de límites y fechas
   - Funciones de burn (quemar no reclamados)
   - Almacenamiento de metadata on-chain

### Frontend Layer

#### **Framework y Build Tools**
- **Framework**: React 18+ con TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + posiblemente Tailwind CSS
- **Routing**: React Router (si necesario) o Next.js Router

#### **Stellar Integration**
- **Wallet**: Freighter Wallet (SDK oficial)
- **Cliente**: `@stellar/stellar-sdk` y `soroban-client`
- **Scaffold**: Stellar Scaffold (base del proyecto)

#### **Estado y Datos**
- **State Management**: React Context API / Zustand (recomendado)
- **Data Fetching**: TanStack Query (React Query) para cacheo
- **Contract Clients**: Clientes TypeScript auto-generados desde contratos

#### **UI/UX Libraries**
- Componentes base: Material-UI o Chakra UI
- Iconos: React Icons
- Formularios: React Hook Form + Zod (validación)
- Notificaciones: React Toastify o similar

#### **QR Code & Geolocation**
- QR Codes: `qrcode.react` o `react-qr-code`
- Geolocation: Browser Geolocation API
- Maps: (opcional) Google Maps o Mapbox

### Backend Layer

#### **Platform**
- **Firebase Functions**: Backend serverless
- **Lenguaje**: TypeScript/Node.js
- **Runtime**: Node.js 18+

#### **Firebase Services**
1. **Firestore**
   - Almacenamiento de metadatos de eventos
   - Gestión de usuarios y planes
   - Tracking de claims y códigos usados
   - Sistema de créditos

2. **Firebase Storage**
   - Almacenamiento de imágenes de POAPs
   - Servir archivos JSON de metadata
   - CDN para imágenes

3. **Firebase Authentication**
   - Autenticación de usuarios (opcional, si se requiere)
   - JWT tokens para API

4. **Firebase Functions**
   - Validación de planes y créditos
   - Procesamiento de pagos
   - Validación de geolocalización
   - Generación de códigos/QRs
   - Webhooks y notificaciones

#### **Payment Processing**
- **Stellar Payments**: Pagos directos en XLM
- **Cliente**: `@stellar/stellar-sdk` en backend
- **Wallet Backend**: Claves de servidor para recibir pagos (si necesario)

#### **External APIs** (opcional)
- **IPFS**: Pinata o Infura para metadata descentralizada (alternativa a Firebase Storage)
- **Email**: SendGrid o Firebase Extensions para notificaciones

### DevOps & Infrastructure

#### **Development**
- **Node.js**: v22+
- **Rust**: Latest stable (para contratos)
- **Cargo**: Package manager de Rust
- **Git**: Control de versiones

#### **Testing**
- **Rust Tests**: `soroban-sdk` testutils
- **Frontend Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright o Cypress

#### **CI/CD**
- **GitHub Actions**: Pipeline de CI/CD
- **Deployment**: Firebase Hosting (frontend) + Firebase Functions (backend)
- **Contract Deployment**: Stellar CLI + scripts personalizados

#### **Monitoring & Analytics**
- **Firebase Analytics**: Métricas de uso
- **Sentry**: Error tracking (opcional)
- **Stellar Network**: Exploradores de blockchain para verificación

## Estructura de Proyecto

```
poap-stellar/
├── contracts/              # Smart Contracts (Rust)
│   ├── factory/           # Factory Contract
│   ├── event/             # Event Contract Template
│   └── shared/            # Código compartido entre contratos
├── packages/              # TypeScript clients auto-generados
├── src/                   # Frontend React App
│   ├── components/        # Componentes React
│   ├── pages/             # Páginas/rutas
│   ├── hooks/             # Custom hooks
│   ├── contracts/         # Utilidades de contratos
│   ├── services/          # Servicios API
│   └── utils/             # Utilidades
├── functions/             # Firebase Functions (Backend)
│   ├── src/
│   │   ├── payments/      # Lógica de pagos
│   │   ├── validation/    # Validaciones
│   │   ├── events/        # CRUD de eventos
│   │   └── claims/        # Procesamiento de claims
│   └── package.json
├── docs/                  # Documentación
│   ├── ARCHITECTURE.md
│   └── TECH_STACK.md
├── environments.toml      # Configuración de entornos
├── package.json           # Frontend dependencies
└── Cargo.toml            # Rust workspace
```

## Decisiones de Diseño

### Metadata Storage

**On-Chain:**
- Struct con información esencial del evento (nombre, fecha, lugar, descripción)
- URI apuntando a metadata JSON completa
- Costo de almacenamiento optimizado

**Off-Chain:**
- JSON completo con toda la metadata en Firebase Storage o IPFS
- Imagen del POAP en Firebase Storage
- Verificable mediante hash/IPFS

### Sistema de Pagos

**Modelo Híbrido:**
- Validación off-chain (Firebase Functions)
- Pago on-chain (Stellar Payments)
- Créditos gestionados en Firestore
- Límites verificados en ambos niveles

### Seguridad

**On-Chain:**
- Validación de permisos en contratos
- Prevención de duplicados
- Límites de mint
- Validación de fechas

**Off-Chain:**
- Validación de planes y créditos
- Rate limiting
- Validación de geolocalización
- Tracking de códigos/QRs usados

## Dependencias Principales

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@stellar/freighter-api": "^1.0.0",
    "@stellar/stellar-sdk": "^11.0.0",
    "soroban-client": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-router-dom": "^6.20.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0"
  }
}
```

### Contracts (Rust)
```toml
[dependencies]
soroban-sdk = "23.0.3"
stellar-tokens = { git = "https://github.com/stellar/stellar-contracts", branch = "main" }
stellar-access = { git = "https://github.com/stellar/stellar-contracts", branch = "main" }
stellar-macros = { git = "https://github.com/stellar/stellar-contracts", branch = "main" }
```

### Backend (Firebase Functions)
```json
{
  "dependencies": {
    "firebase-admin": "^11.11.0",
    "firebase-functions": "^4.5.0",
    "@stellar/stellar-sdk": "^11.0.0",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
```

## Referencias

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)
- [Stellar Tokens Library](https://github.com/stellar/stellar-contracts)
- [Scaffold Stellar](https://github.com/theahaco/scaffold-stellar)
- [Freighter Wallet](https://freighter.app/)
- [Firebase Documentation](https://firebase.google.com/docs)

