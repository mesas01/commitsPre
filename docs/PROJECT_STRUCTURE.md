# Estructura del Proyecto SPOT

## Resumen

Este documento describe la estructura del proyecto SPOT (Stellar Proof of Togetherness) creada en el Paso 1 del desarrollo.

## Estructura de Directorios

```
blockotitos/
├── contracts/                      # Smart Contracts (Rust)
│   ├── spot-factory/              # Factory Contract (NUEVO)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── contract.rs        # Lógica principal del Factory
│   │       ├── error.rs           # Definición de errores
│   │       └── test.rs            # Tests unitarios
│   │
│   ├── spot-event/                # Event Contract Template (NUEVO)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── contract.rs        # Lógica principal del Event
│   │       ├── error.rs           # Definición de errores
│   │       └── test.rs            # Tests unitarios
│   │
│   ├── nft-enumerable/            # Ejemplo de referencia
│   ├── fungible-allowlist/        # Ejemplo de referencia
│   └── guess-the-number/          # Ejemplo de referencia
│
├── docs/                          # Documentación
│   ├── ARCHITECTURE.md           # Diagramas de arquitectura
│   ├── TECH_STACK.md             # Stack tecnológico
│   ├── ROADMAP.md                # Roadmap y planes
│   └── PROJECT_STRUCTURE.md      # Este archivo
│
├── src/                           # Frontend (React/TypeScript)
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── ...
│
├── Cargo.toml                     # Rust workspace configuration
├── package.json                   # Frontend dependencies
└── environments.toml              # Environment configuration
```

## Contratos Implementados

### 1. Factory Contract (`spot-factory`)

**Propósito**: Crear y gestionar instancias de eventos SPOT.

**Funcionalidades principales**:
- `__constructor(admin)`: Inicializa el Factory con un admin
- `admin()`: Obtiene la dirección del admin
- `set_admin(new_admin)`: Actualiza el admin (solo admin actual)
- `create_event(...)`: Crea un nuevo evento (deploya Event Contract)
- `get_event_info(event_id)`: Obtiene información de un evento
- `get_events()`: Obtiene lista de todos los eventos
- `get_event_count()`: Obtiene el número total de eventos

**Estado actual**: ✅ Estructura básica implementada. Falta implementar el deploy real del Event Contract.

**TODO**:
- [ ] Implementar deploy real del Event Contract usando `deployer().deploy_contract()`
- [ ] Integrar validación de planes y pagos
- [ ] Completar tests de integración

### 2. Event Contract (`spot-event`)

**Propósito**: Gestionar SPOTs (NFTs) para un evento específico.

**Funcionalidades principales**:
- `__constructor(...)`: Inicializa el evento con toda su metadata
- `mint(to)`: Mintea un SPOT a una dirección (sin autorización)
- `mint_authorized(to, operator)`: Mintea un SPOT con autorización de roles
- `has_minted(address)`: Verifica si una dirección ya minteó
- `get_event_info()`: Obtiene toda la información del evento
- `burn_unclaimed(operator)`: Quema NFTs no reclamados (automático)
- `grant_minter_role(...)`: Otorga rol de minter
- `revoke_minter_role(...)`: Revoca rol de minter
- `grant_admin_role(...)`: Otorga rol de admin

**Validaciones implementadas**:
- ✅ Verificación de período de claim (start/end)
- ✅ Prevención de duplicados (1 SPOT por wallet)
- ✅ Control de límites de NFTs
- ✅ Control de acceso basado en roles (Owner, Admin, Minter)

**Integraciones**:
- ✅ Stellar NFT Standard (NonFungibleToken)
- ✅ Enumerable extension (para enumerar NFTs)
- ✅ Burnable extension (para quemar NFTs)
- ✅ Access Control (para roles)

**Estado actual**: ✅ Contrato completo implementado con todas las funcionalidades core.

**TODO**:
- [ ] Implementar múltiples colecciones por evento
- [ ] Optimizar almacenamiento de metadata
- [ ] Completar todos los tests

## Próximos Pasos

1. **Compilar y probar los contratos**:
   ```bash
   cd blockotitos
   cargo build --target wasm32v1-none --release --package spot-factory
   cargo build --target wasm32v1-none --release --package spot-event
   ```

2. **Implementar deploy real en Factory**:
   - Necesitamos el WASM hash del Event Contract
   - Usar `deployer().deploy_contract()` correctamente
   - Inicializar el Event Contract con `__constructor()`

3. **Crear Firebase Functions**:
   - Backend para validación de planes
   - Procesamiento de pagos
   - Gestión de créditos

4. **Frontend básico**:
   - Integración con Freighter Wallet
   - Página de creación de eventos
   - Página de claim de SPOTs

## Notas de Desarrollo

### Branding
- **SPOT**: Stellar Proof of Togetherness
- Todos los documentos y código usan "SPOT" en lugar de "POAP"

### Almacenamiento
- **On-chain**: Metadata del evento (nombre, fecha, lugar, descripción, URIs)
- **Off-chain**: Imágenes de los SPOTs (Firebase Storage)

### Sistema de Roles
- **Owner**: Creador del evento, control total
- **Admin**: Puede gestionar roles y configurar evento
- **Minter**: Solo puede mintear SPOTs
- **Viewer**: Solo lectura (implícito en el estándar NFT)

### Validaciones
- **On-chain**: Límites, duplicados, fechas, permisos
- **Off-chain**: Planes, créditos, geolocalización, códigos/QRs

---

**Última actualización**: Noviembre 2024
**Estado**: Paso 1 completado - Estructura de contratos creada

