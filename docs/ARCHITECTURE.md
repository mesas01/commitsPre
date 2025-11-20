# Arquitectura del Sistema SPOT (Stellar Proof of Togetherness)

## Diagrama de Arquitectura General

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

## Flujo de Creación de Evento

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

## Flujo de Claim de SPOT

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

## Estructura de Contratos

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

## Estructura de Datos

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

## Sistema de Permisos y Roles

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

## Métodos de Distribución

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

## Sistema de Créditos y Planes

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

## Arquitectura de Metadata

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

## Seguridad y Validaciones

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

