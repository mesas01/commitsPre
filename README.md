# 🌟 SPOT - Stellar Proof of Togetherness

<div align="center">

![SPOT Logo](https://img.shields.io/badge/SPOT-Stellar%20Proof%20of%20Togetherness-7B61FF?style=for-the-badge&logo=stellar&logoColor=white)

**Sistema descentralizado de NFTs de asistencia construido sobre Stellar Blockchain**

[Características](#-características-principales) • [Arquitectura](#-arquitectura) • [Modelo de Negocio](#-modelo-de-negocio) • [Cómo Funciona](#-cómo-funciona) • [Tech Stack](#-tech-stack) • [Instalación](#-instalación)

[![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=flat&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-FF6B6B?style=flat)](https://developers.stellar.org/docs/build/smart-contracts/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org)

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué es SPOT?](#-qué-es-spot)
- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Cómo Funciona](#-cómo-funciona)
- [Modelo de Negocio](#-modelo-de-negocio)
- [Tech Stack](#-tech-stack)
- [Instalación](#-instalación)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Contribuir](#-contribuir)

---

## 🎯 ¿Qué es SPOT?

**SPOT (Stellar Proof of Togetherness)** es una plataforma descentralizada que permite crear y distribuir NFTs de asistencia a eventos, similar a POAP de Ethereum, pero construido nativamente sobre la red Stellar.

### ¿Por qué Stellar?

- ⚡ **Transacciones rápidas y económicas**: Stellar procesa transacciones en 3-5 segundos con costos mínimos
- 🌍 **Sostenible**: Consumo energético extremadamente bajo comparado con otras blockchains
- 💰 **Escalable**: Capaz de manejar miles de transacciones por segundo
- 🔐 **Seguro**: Smart contracts auditados y verificables en la blockchain

### ¿Qué resuelve SPOT?

SPOT permite a organizadores de eventos:
- ✅ Crear NFTs únicos de asistencia fácilmente
- ✅ Distribuir SPOTs mediante múltiples métodos (QR, Links, Códigos, Geolocalización)
- ✅ Verificar asistencia de forma inmutable en la blockchain
- ✅ Crear múltiples colecciones por evento (Asistente, Ganador, Mentor, etc.)
- ✅ Gestionar roles y permisos de forma descentralizada

---

## ✨ Características Principales

### 🎫 Para Organizadores

- **Creación de Eventos**: Interfaz intuitiva para crear eventos con toda su metadata
- **Múltiples Métodos de Distribución**:
  - 📱 **QR Codes**: Escaneo y claim inmediato
  - 🔗 **Links Únicos**: Links compartibles con expiración configurable
  - 📍 **Geolocalización**: Validación por proximidad
  - 🔑 **Códigos Compartidos**: Códigos especiales para eventos masivos
- **Múltiples Colecciones**: Un evento puede tener varias colecciones de SPOTs
- **Sistema de Roles**: Control granular de permisos (Owner, Admin, Minter)
- **Gestión de Límites**: Controla cuántos SPOTs se pueden emitir
- **Quemado Automático**: Los SPOTs no reclamados se queman automáticamente

### 🎁 Para Asistentes

- **Claim Fácil**: Reclama tu SPOT con un solo clic
- **Galería Personal**: Visualiza todos tus SPOTs en un solo lugar
- **Verificación Permanente**: Prueba de asistencia inmutable en la blockchain
- **Compartible**: Comparte tus SPOTs en redes sociales
- **Wallet Integration**: Usa Freighter Wallet para gestionar tus SPOTs

### 🔒 Seguridad y Validaciones

- **Prevención de Duplicados**: Un wallet solo puede tener 1 SPOT por colección
- **Validación de Fechas**: Períodos de claim configurables (máximo 1 semana)
- **Control de Límites**: Validación tanto on-chain como off-chain
- **Sistema Híbrido**: Validaciones en blockchain + backend para máxima seguridad

---

## 🏗️ Arquitectura

### Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React/Next.js App]
        Wallet[Freighter Wallet]
        UI --> Wallet
    end

    subgraph "Backend Layer"
        Backend[Firebase Functions]
        Auth[Firebase Auth]
        Storage[Firebase Storage]
        Firestore[Firestore DB]
        Backend --> Auth
        Backend --> Storage
        Backend --> Firestore
    end

    subgraph "Blockchain Layer - Stellar"
        Factory[Factory Contract]
        Event1[Event Contract 1]
        Event2[Event Contract 2]
        EventN[Event Contract N]
        Factory --> Event1
        Factory --> Event2
        Factory --> EventN
    end

    subgraph "Payment System"
        Payment[Stellar Payment]
        Credits[Credit Management]
        Backend --> Payment
        Backend --> Credits
    end

    UI --> Backend
    UI --> Factory
    Backend --> Factory
    Factory --> Payment

    style UI fill:#61dafb
    style Factory fill:#7b61ff
    style Backend fill:#ff6b6b
    style Payment fill:#ffd93d
```

### Estructura de Contratos

SPOT utiliza un patrón Factory para crear instancias de eventos:

```mermaid
graph LR
    subgraph "Factory Contract"
        FC[Factory]
        FC --> |create_event| EC[Event Template]
    end

    subgraph "Event Contract"
        EC --> NFT[NFT Standard]
        EC --> AC[Access Control]
        EC --> ST[Storage]
        EC --> MT[Mint Logic]
        EC --> BN[Burn Logic]
    end

    subgraph "NFT Features"
        NFT --> OWN[Ownership]
        NFT --> APP[Approvals]
        NFT --> URI[token_uri]
        NFT --> ENUM[Enumerable]
    end

    style FC fill:#7b61ff
    style EC fill:#ff6b6b
    style NFT fill:#4ecdc4
```

### Almacenamiento de Metadata

**Híbrido On-Chain / Off-Chain**:

```mermaid
graph TB
    subgraph "On-Chain Storage"
        CONTRACT[Event Contract]
        URI[token_uri]
        METADATA[Metadata Struct]
        CONTRACT --> URI
        CONTRACT --> METADATA
    end

    subgraph "Off-Chain Storage"
        JSON[JSON File]
        IMAGE[Image File]
        IPFS[IPFS / Firebase Storage]
        JSON --> IPFS
        IMAGE --> IPFS
    end

    subgraph "Metadata Content"
        M1[event_name]
        M2[event_date]
        M3[location]
        M4[description]
        M5[image_url]
        METADATA --> M1
        METADATA --> M2
        METADATA --> M3
        METADATA --> M4
        METADATA --> M5
    end

    URI --> JSON
    JSON --> IMAGE
```

**Qué se guarda donde**:
- **On-Chain**: Metadata esencial del evento (nombre, fecha, lugar, descripción, URIs) - Verificable e inmutable
- **Off-Chain**: Imágenes de alta resolución (Firebase Storage) - Optimizado para costos

---

## 🔄 Cómo Funciona

### Flujo de Creación de Evento

El organizador crea un evento y el sistema despliega un contrato inteligente:

```mermaid
sequenceDiagram
    participant O as Organizador
    participant UI as Frontend
    participant B as Backend
    participant F as Factory Contract
    participant E as Event Contract
    participant S as Firebase Storage

    O->>UI: Crear evento + elegir plan
    UI->>B: Validar plan y calcular costo
    B->>B: Verificar créditos disponibles
    B->>O: Solicitar pago (Stellar)
    O->>B: Pagar XLM
    B->>B: Descontar créditos del plan
    B->>S: Subir imagen del SPOT
    S-->>B: URL de imagen
    B->>F: Crear nuevo evento
    F->>E: Instanciar Event Contract
    E-->>F: Contract Address
    F-->>B: Event ID + Contract Address
    B->>S: Guardar metadatos (Firestore)
    B-->>UI: Evento creado exitosamente
    UI-->>O: Confirmación
```

**Pasos detallados**:
1. El organizador completa el formulario de creación de evento
2. Selecciona un plan y la cantidad de SPOTs a emitir
3. El sistema valida el plan y calcula el costo
4. El organizador paga con XLM (Stellar)
5. Los créditos se descuentan del plan mensual
6. La imagen del SPOT se sube a Firebase Storage
7. El Factory Contract despliega un nuevo Event Contract
8. La metadata se guarda en Firestore para indexación
9. El evento está listo para distribuir SPOTs

### Flujo de Claim de SPOT

El asistente reclama su SPOT usando uno de los métodos disponibles:

```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as Frontend
    participant B as Backend
    participant E as Event Contract
    participant W as Wallet (Freighter)

    U->>UI: Escanear QR / Usar link / Código
    UI->>B: Validar método de claim
    B->>B: Verificar geolocalización (si aplica)
    B->>B: Verificar códigos/QRs usados
    B->>B: Validar fechas de claim
    B-->>UI: Validación OK
    UI->>W: Solicitar firma de transacción
    W->>U: Confirmar transacción
    U->>W: Firmar transacción
    W->>E: Ejecutar mint()
    E->>E: Validar límites y permisos
    E->>E: Verificar no duplicado
    E->>E: Guardar metadata on-chain
    E-->>W: NFT minteado (token_id)
    W-->>UI: Transacción exitosa
    UI->>B: Notificar claim exitoso
    B->>B: Actualizar contadores
    UI-->>U: SPOT recibido
```

**Validaciones en cada paso**:

1. **Off-Chain (Backend)**:
   - ✅ Verifica el plan del organizador
   - ✅ Valida códigos/QRs usados
   - ✅ Verifica geolocalización (si aplica)
   - ✅ Valida fechas de claim

2. **On-Chain (Smart Contract)**:
   - ✅ Verifica que no haya duplicados (1 SPOT por wallet)
   - ✅ Valida límites de NFTs
   - ✅ Verifica período de claim
   - ✅ Valida permisos de roles

### Métodos de Distribución

SPOT soporta múltiples métodos de distribución, cada uno con sus propias validaciones:

```mermaid
graph LR
    subgraph "Métodos de Claim"
        QR[QR Code]
        LINK[Unique Link]
        GEO[Geolocalización]
        CODE[Shared Code]
    end

    subgraph "Validación"
        V1[Verificar unicidad]
        V2[Verificar expiración]
        V3[Verificar geolocalización]
        V4[Verificar límites]
    end

    QR --> V1
    LINK --> V2
    GEO --> V3
    CODE --> V4

    V1 --> MINT[Mint NFT]
    V2 --> MINT
    V3 --> MINT
    V4 --> MINT
```

**Características de cada método**:

| Método | Descripción | Validación |
|--------|-------------|------------|
| **QR Code** | Código único escaneable | Un QR puede usarse múltiples veces hasta agotar NFTs disponibles. Una wallet solo puede reclamar 1 vez |
| **Unique Link** | Link único por evento | Expira según configuración del organizador (máximo 1 semana) |
| **Geolocalización** | Validación por proximidad | Radio configurable por el organizador. Validación off-chain |
| **Código Compartido** | Código compartible | Limitado a la cantidad de NFTs creados. Se puede usar hasta agotar |

### Sistema de Permisos y Roles

Control granular de acceso basado en roles:

```mermaid
graph TB
    subgraph "Roles"
        OWNER[Owner]
        ADMIN[Admin]
        MINTER[Minter]
        VIEWER[Viewer]
    end

    subgraph "Permisos Owner"
        O1[Crear evento]
        O2[Eliminar evento]
        O3[Modificar evento]
        O4[Agregar/remover roles]
        O5[Mintear SPOTs]
        O6[Quemar SPOTs]
        OWNER --> O1
        OWNER --> O2
        OWNER --> O3
        OWNER --> O4
        OWNER --> O5
        OWNER --> O6
    end

    subgraph "Permisos Admin"
        A1[Modificar evento]
        A2[Agregar/remover roles]
        A3[Mintear SPOTs]
        A4[Quemar SPOTs]
        ADMIN --> A1
        ADMIN --> A2
        ADMIN --> A3
        ADMIN --> A4
    end

    subgraph "Permisos Minter"
        M1[Mintear SPOTs]
        MINTER --> M1
    end

    subgraph "Permisos Viewer"
        V1[Ver eventos]
        V2[Ver SPOTs]
        VIEWER --> V1
        VIEWER --> V2
    end
```

---

## 💰 Modelo de Negocio

### Estructura de Planes

SPOT utiliza un modelo **pay-as-you-go** (pago por uso) con planes basados en costos de almacenamiento de Stellar:

#### 🆓 Plan FREE (Freemium)

| Característica | Valor |
|----------------|-------|
| **Precio** | 0 XLM |
| **Eventos por mes** | 1 |
| **NFTs por evento** | Hasta 50 NFTs |
| **NFTs totales/mes** | 50 NFTs |
| **Wallets delegadas** | 2 gratis |
| **Almacenamiento** | Metadata básica (hash/IPFS) |
| **Período de claim** | Máximo 1 semana |
| **Métodos disponibles** | QR, Link |

**Ideal para**: Organizadores pequeños, eventos de prueba

---

#### 🚀 Plan STARTER

| Característica | Valor |
|----------------|-------|
| **Precio** | 2 XLM por evento |
| **Eventos por mes** | 5 (o 5 simultáneos) |
| **NFTs por evento** | Hasta 200 NFTs |
| **NFTs totales/mes** | 1,000 NFTs (créditos compartibles) |
| **Wallets delegadas** | 2 gratis + 0.5 XLM por wallet adicional |
| **Almacenamiento** | Metadata JSON completa on-chain |
| **Período de claim** | Configurable (máximo 1 semana) |
| **Métodos disponibles** | QR, Link, Códigos compartidos |

**Ideal para**: Organizadores regulares, meetups, conferencias pequeñas

**Ejemplo de uso**:
- Compras Plan STARTER → Tienes 1,000 créditos de NFTs
- Creas Evento 1 con 200 NFTs → Restan 800 créditos
- Creas Evento 2 con 300 NFTs → Restan 500 créditos
- Creas Evento 3 con 500 NFTs → Restan 0 créditos
- Si necesitas más, compras créditos adicionales o esperas al próximo mes

---

#### ⭐ Plan PRO

| Característica | Valor |
|----------------|-------|
| **Precio** | 5 XLM por evento |
| **Eventos por mes** | Ilimitados |
| **NFTs por evento** | Hasta 1,000 NFTs |
| **NFTs totales/mes** | Ilimitados (pago por evento) |
| **Wallets delegadas** | 2 gratis + 0.3 XLM por wallet adicional |
| **Almacenamiento** | Metadata JSON completa on-chain |
| **Período de claim** | Configurable (máximo 1 semana) |
| **Métodos disponibles** | Todos (QR, Link, Geolocalización, Códigos) |
| **Soporte** | Prioridad |

**Ideal para**: Organizadores profesionales, conferencias grandes, hackathons

---

#### 🏢 Plan ENTERPRISE (Custom)

| Característica | Valor |
|----------------|-------|
| **Precio** | Negociable (mensualidad o por evento) |
| **Eventos por mes** | Ilimitados |
| **NFTs por evento** | Ilimitados |
| **Wallets delegadas** | Ilimitadas gratis |
| **Almacenamiento** | Metadata JSON completa on-chain |
| **Período de claim** | Personalizable |
| **Métodos disponibles** | Todos + personalizaciones |
| **Soporte** | Dedicado |
| **Personalización** | APIs custom, branding, integraciones |

**Ideal para**: Grandes empresas, plataformas de eventos, partners estratégicos

---

### Sistema de Créditos

**¿Cómo funcionan los créditos?**

1. **Compra de Plan**: Al comprar un plan, recibes créditos de NFTs para ese mes
2. **Uso Flexible**: Puedes usar los créditos en múltiples eventos
3. **Compartibles**: Si compras 1,000 NFTs/mes, puedes crear 5 eventos con 200 NFTs cada uno, o 1 evento con 1,000 NFTs
4. **Expiración**: Los créditos no usados expiran al final del mes calendario
5. **Compra Adicional**: Puedes comprar créditos adicionales en cualquier momento

**Ejemplo práctico**:
```
📅 Inicio del mes: Compras Plan STARTER (1,000 NFTs)
   ├─ Evento "Hackathon" (200 NFTs) → Créditos: 800
   ├─ Evento "Workshop" (300 NFTs) → Créditos: 500
   └─ Evento "Networking" (500 NFTs) → Créditos: 0
   
📅 Fin del mes: Créditos no usados expiran
```

### Flujo de Créditos y Planes

```mermaid
stateDiagram-v2
    [*] --> VerificarPlan
    VerificarPlan --> PlanFree: Plan Free
    VerificarPlan --> PlanStarter: Plan Starter
    VerificarPlan --> PlanPro: Plan Pro
    VerificarPlan --> PlanEnterprise: Plan Enterprise
    
    PlanFree --> CrearEvento: 1 evento/mes
    PlanStarter --> CrearEvento: 5 eventos/mes
    PlanPro --> CrearEvento: Ilimitado
    PlanEnterprise --> CrearEvento: Ilimitado
    
    CrearEvento --> DescontarCreditos
    DescontarCreditos --> VerificarCreditos
    VerificarCreditos --> CreditosDisponibles: Créditos OK
    VerificarCreditos --> SinCreditos: Sin créditos
    
    CreditosDisponibles --> ProcesarPago
    SinCreditos --> SolicitarPago
    
    SolicitarPago --> ProcesarPago: Usuario paga
    ProcesarPago --> DesplegarContrato
    DesplegarContrato --> [*]
```

---

## 🛠️ Tech Stack

### Blockchain Layer

- **Red**: Stellar Network (Futurenet para pruebas, Mainnet para producción)
- **Smart Contracts**: Soroban (Runtime de Stellar)
- **Lenguaje**: Rust
- **SDK**: Soroban SDK v23.0.3+
- **Estándar NFT**: SEP-41 (Stellar Enhancement Proposal 41)
- **Librerías**:
  - `stellar-tokens`: NFTs estándar de Stellar
  - `stellar-access`: Control de acceso y roles
  - `stellar-macros`: Macros para simplificar código

### Frontend Layer

- **Framework**: React 18+ con TypeScript
- **Build Tool**: Vite
- **Wallet**: Freighter Wallet SDK
- **Cliente Stellar**: `@stellar/stellar-sdk` y `soroban-client`
- **Estado**: React Context API / Zustand
- **Data Fetching**: TanStack Query
- **UI Components**: Material-UI o Chakra UI

### Backend Layer

- **Platform**: Firebase Functions (TypeScript/Node.js)
- **Firebase Services**:
  - **Firestore**: Metadatos de eventos, usuarios, créditos
  - **Firebase Storage**: Imágenes de SPOTs
  - **Firebase Auth**: Autenticación (opcional)
- **Payment Processing**: Stellar Payments (XLM)

### DevOps

- **CI/CD**: GitHub Actions
- **Testing**: Vitest (frontend), Rust tests (contratos)
- **Deployment**: Firebase Hosting (frontend), Firebase Functions (backend)
- **Monitoring**: Firebase Analytics, Sentry (opcional)

---

## 📦 Instalación

### Prerrequisitos

- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Node.js](https://nodejs.org/) v22+
- [Stellar CLI](https://github.com/stellar/stellar-core)
- [Scaffold Stellar CLI Plugin](https://github.com/AhaLabs/scaffold-stellar)

### Setup del Proyecto

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd commitsPre

# 2. Configurar variables de entorno
cd blockotitos
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Instalar dependencias del frontend
npm install

# 4. Compilar contratos
cargo build --target wasm32v1-none --release

# 5. Iniciar entorno de desarrollo
npm run dev
```

### Configuración de Entornos

Edita `environments.toml` para configurar tus entornos (local, testnet, mainnet).

---

## 🎨 Decisiones de Diseño

### 1. Arquitectura Híbrida (On-Chain / Off-Chain)

**¿Por qué?**

- **On-Chain**: Metadata esencial (verificable e inmutable)
- **Off-Chain**: Imágenes y datos grandes (optimización de costos)

**Beneficios**:
- ✅ Costos reducidos de almacenamiento en blockchain
- ✅ Verificabilidad completa de metadata esencial
- ✅ Escalabilidad mejorada

### 2. Sistema de Validación Dual

**Validaciones On-Chain**:
- Límites de NFTs
- Prevención de duplicados
- Fechas de claim
- Permisos de roles

**Validaciones Off-Chain**:
- Planes y créditos del usuario
- Geolocalización
- Tracking de códigos/QRs usados
- Rate limiting

**Beneficios**:
- ✅ Seguridad máxima
- ✅ Flexibilidad para lógica compleja
- ✅ Optimización de costos

### 3. Factory Pattern para Contratos

**¿Por qué usar Factory?**

- ✅ Escalabilidad: Cada evento es un contrato independiente
- ✅ Aislamiento: Problemas en un evento no afectan otros
- ✅ Actualización: Posibilidad de mejorar contratos nuevos sin afectar existentes

### 4. Sistema de Créditos Mensuales

**¿Por qué créditos que expiran?**

- ✅ Flexibilidad: Usa los créditos en múltiples eventos
- ✅ Transparencia: Planes claros y predecibles
- ✅ Optimización: Incentiva uso eficiente de recursos

### 5. Múltiples Métodos de Distribución

**¿Por qué varios métodos?**

- ✅ Adaptabilidad: Diferentes eventos requieren diferentes métodos
- ✅ Usabilidad: Los usuarios pueden elegir el método más conveniente
- ✅ Flexibilidad: Los organizadores pueden configurar según necesidades

---

## 🗄️ Estructura de Datos

### Modelo de Datos Principal

```mermaid
erDiagram
    USER ||--o{ EVENT : creates
    USER ||--o{ CREDIT : owns
    EVENT ||--o{ COLLECTION : has
    COLLECTION ||--o{ SPOT : contains
    EVENT ||--o{ DELEGATE : has
    EVENT ||--o{ QR_CODE : generates
    EVENT ||--o{ CLAIM_CODE : generates
    
    USER {
        string address
        string email
        timestamp created_at
        string plan_type
    }
    
    CREDIT {
        string user_id
        int nft_credits
        int wallet_delegates
        timestamp expires_at
        timestamp created_at
    }
    
    EVENT {
        string id
        string contract_address
        string creator_address
        string name
        date event_date
        string location
        string description
        timestamp claim_start
        timestamp claim_end
        int max_nfts
        int minted_nfts
        string image_url
    }
    
    COLLECTION {
        string id
        string event_id
        string name
        int max_nfts
        int minted_nfts
    }
    
    SPOT {
        string token_id
        string collection_id
        string owner_address
        string metadata_uri
        timestamp minted_at
    }
    
    DELEGATE {
        string event_id
        string address
        string role
        timestamp added_at
    }
    
    QR_CODE {
        string id
        string event_id
        string code
        bool used
        int uses_remaining
        timestamp expires_at
    }
    
    CLAIM_CODE {
        string id
        string event_id
        string code
        int uses_remaining
        timestamp expires_at
    }
```

---

## 🔒 Seguridad y Validaciones

### Capas de Seguridad

```mermaid
graph TB
    subgraph "Validaciones On-Chain"
        V1[Límite de NFTs]
        V2[No duplicados]
        V3[Permisos de roles]
        V4[Fechas de claim]
        V5[Ownership]
    end

    subgraph "Validaciones Off-Chain"
        V6[Plan del usuario]
        V7[Créditos disponibles]
        V8[Geolocalización]
        V9[Códigos/QRs usados]
        V10[Rate limiting]
    end

    subgraph "Backend Security"
        S1[Firebase Auth]
        S2[JWT Tokens]
        S3[API Rate Limits]
        S4[IP Whitelisting]
    end

    V1 --> CONTRACT[Smart Contract]
    V2 --> CONTRACT
    V3 --> CONTRACT
    V4 --> CONTRACT
    V5 --> CONTRACT

    V6 --> BACKEND[Backend]
    V7 --> BACKEND
    V8 --> BACKEND
    V9 --> BACKEND
    V10 --> BACKEND

    S1 --> BACKEND
    S2 --> BACKEND
    S3 --> BACKEND
    S4 --> BACKEND
```

### Medidas de Seguridad Implementadas

- ✅ **Validación dual**: On-chain + Off-chain
- ✅ **Prevención de duplicados**: Un wallet = 1 SPOT por colección
- ✅ **Rate limiting**: Prevención de spam y ataques
- ✅ **Control de acceso**: Sistema de roles granular
- ✅ **Validación de fechas**: Períodos de claim configurables
- ✅ **Quemado automático**: SPOTs no reclamados se queman automáticamente

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Contribución

- Lee nuestro [Código de Conducta](CODE_OF_CONDUCT.md)
- Revisa nuestro [CONTRIBUTING.md](CONTRIBUTING.md)
- Asegúrate de que los tests pasen
- Actualiza la documentación según sea necesario

---

## 📄 Licencia

Este proyecto está bajo la Licencia Apache-2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🔗 Enlaces Útiles

- [Documentación de Stellar](https://developers.stellar.org/)
- [Documentación de Soroban](https://developers.stellar.org/docs/build/smart-contracts/)
- [Freighter Wallet](https://freighter.app/)
- [Scaffold Stellar](https://github.com/theahaco/scaffold-stellar)

---

## 📞 Contacto

Para preguntas, sugerencias o soporte:

- 📧 Email: [tu-email@ejemplo.com]
- 💬 Discord: [tu-servidor-discord]
- 🐦 Twitter: [@tu-twitter]

---

<div align="center">

**Hecho con ❤️ usando Stellar Blockchain**

[⭐ Dános una estrella](https://github.com/tu-usuario/tu-repo) • [🐛 Reportar Bug](https://github.com/tu-usuario/tu-repo/issues) • [💡 Sugerir Feature](https://github.com/tu-usuario/tu-repo/issues)

</div>

---

## 📝 Notas Finales

### Estado del Proyecto

- ✅ **Paso 1 Completado**: Contratos Factory y Event implementados
- 🚧 **En Desarrollo**: Backend y Frontend
- 📅 **Próximos Pasos**: Ver [ROADMAP.md](docs/ROADMAP.md)

### Roadmap

Para ver el roadmap completo de desarrollo, consulta [docs/ROADMAP.md](docs/ROADMAP.md).

### Documentación Adicional

- [Arquitectura Completa](docs/ARCHITECTURE.md)
- [Tech Stack Detallado](docs/TECH_STACK.md)
- [Estructura del Proyecto](docs/PROJECT_STRUCTURE.md)

---

**Última actualización**: Noviembre 2024

