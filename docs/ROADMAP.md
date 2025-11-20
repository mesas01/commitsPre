# Roadmap y Planes de Desarrollo - SPOT (Stellar Proof of Togetherness)

## Resumen del Proyecto

Sistema de SPOTs (Stellar Proof of Togetherness) para eventos en Stellar Blockchain, permitiendo crear NFTs de asistencia con múltiples métodos de distribución (QR, Link, Geolocalización, Códigos).

## Estructura de Planes de Precios

### Plan FREE (Freemium)
- **Precio**: 0 XLM
- **Eventos por mes**: 1
- **NFTs por evento**: Hasta 50 NFTs
- **Wallets delegadas**: 2 gratis
- **Almacenamiento**: Metadata básica (hash/IPFS)
- **Periodo de claim**: Máximo 1 semana
- **Límites**: Sin geolocalización, solo QR y Link

**Caso de uso**: Organizadores pequeños, eventos de prueba

### Plan STARTER
- **Precio**: 2 XLM por evento
- **Eventos por mes**: 5 (o 5 eventos simultáneos)
- **NFTs por evento**: Hasta 200 NFTs
- **NFTs totales al mes**: 1000 NFTs
- **Wallets delegadas**: 2 gratis + 0.5 XLM por wallet adicional
- **Almacenamiento**: Metadata JSON completa on-chain
- **Periodo de claim**: Configurable (máximo 1 semana)
- **Métodos**: QR, Link, Códigos compartidos

**Caso de uso**: Organizadores regulares, meetups, conferencias pequeñas

### Plan PRO
- **Precio**: 5 XLM por evento
- **Eventos por mes**: Ilimitados
- **NFTs por evento**: Hasta 1,000 NFTs
- **NFTs totales al mes**: Ilimitados (pago por evento)
- **Wallets delegadas**: 2 gratis + 0.3 XLM por wallet adicional
- **Almacenamiento**: Metadata JSON completa on-chain
- **Periodo de claim**: Configurable (máximo 1 semana)
- **Métodos**: Todos (QR, Link, Geolocalización, Códigos)
- **Soporte**: Prioridad

**Caso de uso**: Organizadores profesionales, conferencias grandes, hackathons

### Plan ENTERPRISE (Custom)
- **Precio**: Negociable (mensualidad o por evento)
- **Eventos por mes**: Ilimitados
- **NFTs por evento**: Ilimitados
- **Wallets delegadas**: Ilimitadas gratis
- **Almacenamiento**: Metadata JSON completa on-chain
- **Periodo de claim**: Personalizable
- **Métodos**: Todos + personalizaciones
- **Soporte**: Dedicado
- **Personalización**: APIs custom, branding, integraciones

**Caso de uso**: Grandes empresas, plataformas de eventos, partners estratégicos

## Sistema de Créditos

### Funcionamiento
- Los NFTs comprados en un plan se convierten en "créditos"
- Los créditos son válidos durante el mes calendario
- Se pueden usar en múltiples eventos (hasta agotar créditos)
- Los créditos no usados expiran al final del mes
- Se pueden comprar créditos adicionales en cualquier momento

### Ejemplo de Uso
- Usuario compra Plan STARTER (1000 NFTs/mes)
- Crea Evento 1 con 200 NFTs → Restan 800 créditos
- Crea Evento 2 con 300 NFTs → Restan 500 créditos
- Crea Evento 3 con 500 NFTs → Restan 0 créditos
- Si necesita más, compra créditos adicionales o espera al próximo mes

## Roadmap de Desarrollo

### FASE 1: Fundación (Días 1-2)

#### 1.1 Setup del Proyecto
- [ ] Configurar estructura del proyecto
- [ ] Setup de Rust workspace para contratos
- [ ] Setup de React/Vite frontend
- [ ] Configurar Stellar Scaffold
- [ ] Setup de Firebase (Firestore, Storage, Functions)
- [ ] Configurar entornos (Local, Testnet)

#### 1.2 Contrato Factory
- [ ] Crear Factory Contract básico
- [ ] Función `create_event()` con parámetros básicos
- [ ] Validación de planes y pagos
- [ ] Registro de eventos creados
- [ ] Tests unitarios del Factory

#### 1.3 Contrato Event (Template)
- [ ] Crear Event Contract basado en NFT estándar
- [ ] Implementar `mint()` básico
- [ ] Almacenamiento de metadata on-chain
- [ ] Control de límites de NFTs
- [ ] Tests unitarios del Event Contract

**Entregables**: Contratos básicos funcionales, tests pasando

---

### FASE 2: Funcionalidades Core (Días 2-3)

#### 2.1 Sistema de Permisos y Roles
- [ ] Implementar Access Control (Owner, Admin, Minter, Viewer)
- [ ] Funciones para agregar/remover roles
- [ ] Validación de permisos en mint
- [ ] Funciones de delegación

#### 2.2 Lógica de Mint Avanzada
- [ ] Validación de no duplicados (1 NFT por wallet por colección)
- [ ] Validación de fechas de claim
- [ ] Control de límites de NFTs
- [ ] Soporte para múltiples colecciones por evento

#### 2.3 Sistema de Burn (Quemar)
- [ ] Función `burn_unclaimed()` automática
- [ ] Burn manual por Owner/Admin
- [ ] Validación de fechas de expiración
- [ ] Eventos de burn para tracking

#### 2.4 Métodos de Distribución Básicos
- [ ] Método QR: Códigos únicos por evento
- [ ] Método Link: Link único por evento con expiración
- [ ] Validación de uso único por wallet
- [ ] Tracking de códigos/link usados (Firestore)

**Entregables**: Contratos completos con todas las funciones core

---

### FASE 3: Backend y Validaciones (Día 3-4)

#### 3.1 Firebase Functions - Payments
- [ ] Endpoint para validar planes
- [ ] Cálculo de costos de eventos
- [ ] Procesamiento de pagos Stellar
- [ ] Gestión de créditos en Firestore
- [ ] Sistema de expiración de créditos mensual

#### 3.2 Firebase Functions - Event Management
- [ ] CRUD de eventos en Firestore
- [ ] Validación de límites de plan
- [ ] Generación de códigos QR únicos
- [ ] Generación de links únicos
- [ ] Subida de imágenes a Firebase Storage

#### 3.3 Firebase Functions - Claim Validation
- [ ] Validación de códigos QR usados
- [ ] Validación de links usados
- [ ] Validación de códigos compartidos
- [ ] Tracking de claims en Firestore
- [ ] Rate limiting por wallet

#### 3.4 Integración On-Chain/Off-Chain
- [ ] Sincronización de datos
- [ ] Webhooks de eventos de contrato
- [ ] Actualización de contadores
- [ ] Manejo de errores y reintentos

**Entregables**: Backend completo con todas las validaciones

---

### FASE 4: Frontend Básico (Día 4-5)

#### 4.1 Setup de Componentes Base
- [ ] Configurar Freighter Wallet integration
- [ ] Componente de conexión de wallet
- [ ] Layout principal de la app
- [ ] Sistema de routing
- [ ] Estado global (Context/Zustand)

#### 4.2 Página de Creación de Eventos
- [ ] Formulario de creación de evento
- [ ] Selección de plan
- [ ] Upload de imagen
- [ ] Configuración de fechas y límites
- [ ] Configuración de métodos de distribución
- [ ] Integración con Factory Contract

#### 4.3 Página de Claim de SPOTs
- [ ] Interfaz para escanear QR
- [ ] Interfaz para ingresar código
- [ ] Interfaz para usar link
- [ ] Solicitud de permisos de geolocalización
- [ ] Confirmación de transacción
- [ ] Feedback de éxito/error

#### 4.4 Integración con Contratos
- [ ] Clientes TypeScript auto-generados
- [ ] Hooks para interacción con contratos
- [ ] Manejo de transacciones
- [ ] Actualización de estado en tiempo real

**Entregables**: Frontend básico funcional

---

### FASE 5: Métodos Avanzados (Día 5)

#### 5.1 Geolocalización
- [ ] Solicitud de permisos de ubicación
- [ ] Validación de coordenadas en backend
- [ ] Configuración de radio permitido
- [ ] Validación on-chain de ubicación (si es viable)

#### 5.2 Códigos Compartidos
- [ ] Generación de códigos compartidos
- [ ] Validación de límites de uso
- [ ] Tracking de usos restantes
- [ ] Interfaz para ingresar código

#### 5.3 NFC (Futuro - MVP puede esperar)
- [ ] Investigación de soporte NFC en navegadores
- [ ] Implementación básica si es viable
- [ ] Validación de tags NFC

**Entregables**: Todos los métodos de distribución funcionando

---

### FASE 6: UX y Galería (Día 5-6)

#### 6.1 Galería de SPOTs
- [ ] Página para ver todos los SPOTs del usuario
- [ ] Filtros por evento, fecha, colección
- [ ] Visualización de metadata completa
- [ ] Compartir en redes sociales (opcional)

#### 6.2 Dashboard del Organizador
- [ ] Vista de eventos creados
- [ ] Estadísticas de claims
- [ ] Gestión de roles y delegados
- [ ] Configuración de eventos activos

#### 6.3 Mejoras de UX
- [ ] Loading states
- [ ] Mensajes de error amigables
- [ ] Confirmaciones y modales
- [ ] Notificaciones toast
- [ ] Diseño responsive

**Entregables**: Aplicación completa con buena UX

---

### FASE 7: Testing y Optimización (Día 6-7)

#### 7.1 Testing
- [ ] Tests unitarios de contratos (completos)
- [ ] Tests de integración frontend-backend
- [ ] Tests E2E de flujos principales
- [ ] Tests de carga en backend

#### 7.2 Optimización
- [ ] Optimización de costos de contratos
- [ ] Cacheo de lecturas de blockchain
- [ ] Optimización de imágenes
- [ ] Lazy loading de componentes

#### 7.3 Documentación
- [ ] Documentación de API (backend)
- [ ] Documentación de contratos
- [ ] Guía de usuario
- [ ] README completo

**Entregables**: Sistema completo, testeado y optimizado

---

### FASE 8: Deploy y Demo (Día 7)

#### 8.1 Deploy en Testnet
- [ ] Deploy de contratos en Futurenet
- [ ] Configuración de backend en Firebase
- [ ] Deploy de frontend
- [ ] Verificación de funcionamiento

#### 8.2 Preparación de Demo
- [ ] Crear eventos de ejemplo
- [ ] Preparar casos de uso
- [ ] Screenshots/videos de demo
- [ ] Presentación para jueces

#### 8.3 Monitoreo
- [ ] Setup de analytics
- [ ] Error tracking
- [ ] Métricas de uso

**Entregables**: Sistema desplegado y listo para demo

---

## Consideraciones Especiales

### Costos de Almacenamiento
- Basar precios en costos reales de Stellar
- Metadata on-chain: ~1-2KB por SPOT
- Optimizar storage usando estructuras eficientes
- Considerar IPFS como alternativa para metadata grande

### Escalabilidad
- Diseñar contratos para manejar miles de NFTs
- Backend con rate limiting y cacheo
- Firebase con índices optimizados
- Considerar batch operations cuando sea posible

### Seguridad
- Validar todo en ambos niveles (on-chain y off-chain)
- Rate limiting para prevenir spam
- Validación de permisos estricta
- Manejo seguro de claves privadas

### Monetización
- Sistema de pagos transparente
- Dashboard de créditos para usuarios
- Notificaciones de expiración
- Opciones de upgrade de plan

## Métricas de Éxito

### MVP (Hackathon)
- ✅ Crear eventos con planes
- ✅ Mintear SPOTs con QR y Link
- ✅ Galería básica de SPOTs
- ✅ Validaciones principales funcionando

### Post-Hackathon
- 📊 Analytics de uso
- 💰 Sistema de pagos funcionando
- 🔒 Seguridad auditada
- 📱 Versión mobile (opcional)

## Próximos Pasos Inmediatos

1. ✅ Definir arquitectura completa
2. ✅ Establecer planes de precios
3. ⏳ Crear estructura del proyecto
4. ⏳ Implementar Factory Contract
5. ⏳ Implementar Event Contract base

---

**Última actualización**: Noviembre 2024
**Estado**: Planeamiento completado, listo para desarrollo

