# 🎨 Propuesta de Diseño Frontend SPOT - Mobile First

## 📱 Estrategia Mobile-First

### ¿Qué significa Mobile-First?

**Mobile-First** significa diseñar primero para móviles y luego expandir a desktop. Es lo opuesto al enfoque tradicional.

### ¿Por qué Mobile-First para SPOT?

1. **Acceso en eventos**: Los usuarios reclaman SPOTs en eventos usando sus móviles
2. **QR/Geolocalización**: Funcionalidades nativas móviles
3. **Mayoría móvil**: La mayoría de usuarios accede desde móvil
4. **Mejor performance**: Cargas más rápidas en móvil = mejor experiencia

### Enfoque Técnico

**Tailwind CSS** (ya lo tienes) es perfecto para mobile-first:
- Clases responsive: `sm:`, `md:`, `lg:`, `xl:`
- Mobile por defecto, luego agregas breakpoints
- Utilities que escalan naturalmente

**Ejemplo:**
```tsx
// Mobile-first: diseño base es móvil
<div className="p-4 md:p-6 lg:p-8">
  // p-4 en móvil, p-6 en tablet, p-8 en desktop
</div>
```

---

## 🎨 Paleta de Colores

### Colores Definidos

```css
/* Colores principales */
--color-white: #FFFFFF;      /* Predominante - fondos */
--color-black: #000000;      /* Texto principal */
--color-yellow: #FDDA24;     /* Detalles, CTAs, highlights */
--color-purple: #AFA4E2;     /* Detalles, borders, acentos */
```

### Configuración en Tailwind

Agregar a `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'spot-white': '#FFFFFF',
        'spot-black': '#000000',
        'spot-yellow': '#FDDA24',
        'spot-purple': '#AFA4E2',
      },
    },
  },
}
```

### Uso de Colores

- **Fondos**: Blanco predominante (`bg-white` o `bg-spot-white`)
- **Texto**: Negro (`text-black` o `text-spot-black`)
- **Botones principales**: Amarillo (`bg-spot-yellow text-black`)
- **Botones secundarios**: Morado (`bg-spot-purple text-white`)
- **Bordes**: Morado suave (`border-spot-purple/20`)
- **Acentos**: Amarillo para highlights, morado para detalles

---

## 📐 Estructura de Pantallas

### 1. **Home / Colección** (`/`)
**Descripción**: Página principal mostrando SPOTs organizados por mes/año

**Elementos**:
- Header con:
  - Logo/nombre SPOT
  - Botón "Perfil" (icono de usuario)
  - Botón "Mint" (flotante o en header)
- Contador de SPOTs totales
- Secciones por mes/año:
  - Noviembre 2025 (3 SPOTs)
  - Octubre 2025 (5 SPOTs)
  - etc.
- Cada SPOT muestra:
  - Imagen/badge
  - Nombre del evento
  - Fecha
  - Verificación (badge "Verified")

**Mobile Layout**:
```
┌─────────────────────┐
│ [Logo] [Perfil] [⚡] │ Header
├─────────────────────┤
│                     │
│   📊 15 SPOTs       │ Contador
│                     │
├─────────────────────┤
│ 📅 Noviembre 2025   │
│ ┌───┐ ┌───┐ ┌───┐  │
│ │ 🎯│ │ 🚀│ │ 💻│  │ Grid SPOTs
│ └───┘ └───┘ └───┘  │
├─────────────────────┤
│ 📅 Octubre 2025     │
│ ┌───┐ ┌───┐        │
│ │ 🎨│ │ ⚡│        │
│ └───┘ └───┘        │
└─────────────────────┘
```

**Desktop Layout**:
- Grid más amplio (3-4 columnas)
- Sidebar opcional con filtros

---

### 2. **Mint / Reclamar SPOT** (`/mint` o modal)
**Descripción**: Pantalla para reclamar SPOTs usando diferentes métodos

**Elementos**:
- Título: "Reclamar tu SPOT"
- Opciones de método:
  - 📷 **Escanear QR** (abre cámara)
  - 🔗 **Usar Link** (input para pegar link)
  - 📍 **Geolocalización** (botón que solicita permisos)
  - 💳 **NFC** (solo si el dispositivo soporta)
  - 🔢 **Código** (input para código compartido)

**Mobile Layout**:
```
┌─────────────────────┐
│  ← Reclamar SPOT    │
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │
│ │   📷 Escanear   │ │ Botón grande
│ │      QR         │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   🔗 Usar Link  │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ 📍 Cercanía     │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   💳 NFC        │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │  🔢 Código      │ │
│ └─────────────────┘ │
└─────────────────────┘
```

**Estados**:
- Estado inicial: Lista de opciones
- Estado de escaneo: Cámara activa (QR)
- Estado de carga: "Procesando..."
- Estado de éxito: "¡SPOT reclamado!" → Redirige a Home
- Estado de error: Mensaje de error específico

---

### 3. **Crear Evento** (`/create-event` o `/organizer/create`)
**Descripción**: Formulario para organizadores crear nuevos eventos

**Elementos**:
- Formulario con:
  - Nombre del evento
  - Fecha del evento
  - Ubicación
  - Descripción
  - Imagen/badge (upload)
  - Máximo de SPOTs
  - Período de claim (inicio/fin)
  - Métodos de distribución habilitados (checkboxes)
- Selector de plan (si aplica)
- Botón "Crear Evento" → ejecuta `create_event()`

**Mobile Layout**:
```
┌─────────────────────┐
│  ← Crear Evento     │
├─────────────────────┤
│                     │
│ Nombre:             │ Input
│ [_______________]   │
│                     │
│ Fecha:              │ Date picker
│ [📅 Seleccionar]    │
│                     │
│ Ubicación:          │
│ [_______________]   │
│                     │
│ Descripción:        │ Textarea
│ [_______________]   │
│ [_______________]   │
│                     │
│ Imagen:             │ Upload
│ [📤 Subir imagen]   │
│                     │
│ Máx. SPOTs:         │
│ [____]              │
│                     │
│ [✓] QR              │ Checkboxes
│ [✓] Link            │
│ [ ] Geoloc          │
│ [ ] Código          │
│                     │
│ [ Crear Evento ]    │ Botón amarillo
└─────────────────────┘
```

---

### 4. **Perfil de Usuario** (`/profile`)
**Descripción**: Información del usuario y configuración

**Elementos**:
- Información de wallet:
  - Dirección (copiable)
  - Balance (XLM)
  - Plan actual (si es organizador)
- Estadísticas:
  - Total de SPOTs
  - Eventos asistidos
  - SPOTs por año
- Botones:
  - "Mis Eventos" (si es organizador)
  - "Conectar Wallet" (si no está conectada)
  - "Ajustes"
  - "Desconectar"

**Mobile Layout**:
```
┌─────────────────────┐
│  ← Perfil           │
├─────────────────────┤
│                     │
│   👤 Avatar         │
│   GBDZ...B2         │ Address (copiar)
│                     │
├─────────────────────┤
│ 📊 Estadísticas     │
│ 15 SPOTs totales    │
│ 8 eventos           │
│                     │
├─────────────────────┤
│ [ Mis Eventos ]     │ Botón
│ [ Ajustes ]         │
│ [ Notificaciones ]  │
│ [ Desconectar ]     │ Botón rojo
└─────────────────────┘
```

---

### 5. **Buscar Eventos** (`/events` o `/explore`)
**Descripción**: Descubrir eventos disponibles para asistir

**Elementos**:
- Barra de búsqueda
- Filtros:
  - Por fecha
  - Por ubicación
  - Por categoría
- Lista/grid de eventos:
  - Imagen
  - Nombre
  - Fecha
  - Ubicación
  - Estado (Próximo, Activo, Finalizado)
- Botón "Ver Detalles" en cada evento

**Mobile Layout**:
```
┌─────────────────────┐
│  🔍 Buscar eventos  │ Search bar
├─────────────────────┤
│ [ Filtros ▼ ]       │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ 🎯 Hackathon    │ │ Card evento
│ │ Nov 15, 2025    │ │
│ │ Bogotá          │ │
│ │ [ Ver ]         │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ 🚀 Workshop     │ │
│ │ Nov 20, 2025    │ │
│ │ Medellín        │ │
│ │ [ Ver ]         │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

### 6. **Detalle de Evento** (`/events/:eventId`)
**Descripción**: Información detallada de un evento

**Elementos**:
- Header con imagen del evento
- Información:
  - Nombre
  - Fecha y hora
  - Ubicación (con mapa si aplica)
  - Descripción
  - Creador
- Estado:
  - "Claim disponible" o "Ya finalizó"
- Botones:
  - "Reclamar SPOT" (si está activo)
  - "Compartir evento"

---

### 7. **Ajustes** (`/settings`)
**Descripción**: Configuración de la aplicación

**Elementos**:
- Red (Testnet/Mainnet)
- Notificaciones:
  - Push notifications
  - Email notifications
- Idioma
- Tema (claro/oscuro - futuro)
- Versión de la app

---

### 8. **Notificaciones** (`/notifications`)
**Descripción**: Centro de notificaciones

**Elementos**:
- Lista de notificaciones:
  - SPOT reclamado exitosamente
  - Nuevo evento creado por organizador seguido
  - Recordatorio de evento próximo
  - etc.
- Mark as read/unread
- Filtros

---

## 🗂️ Estructura de Archivos Sugerida

```
src/
├── pages/
│   ├── Home.tsx                    # ✅ Ya existe (modificar)
│   ├── Mint.tsx                    # 🆕 Nueva
│   ├── CreateEvent.tsx             # 🆕 Nueva
│   ├── Profile.tsx                 # 🆕 Nueva
│   ├── Events.tsx                  # 🆕 Nueva (explorar eventos)
│   ├── EventDetail.tsx             # 🆕 Nueva
│   ├── Settings.tsx                # 🆕 Nueva
│   ├── Notifications.tsx           # 🆕 Nueva
│   └── Debugger.tsx                # ✅ Ya existe
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # 🆕 Extraer header
│   │   ├── BottomNav.tsx           # 🆕 Navegación móvil inferior
│   │   └── Box.tsx                 # ✅ Ya existe
│   │
│   ├── spot/
│   │   ├── SpotCard.tsx            # 🆕 Tarjeta de SPOT
│   │   ├── SpotGrid.tsx            # 🆕 Grid de SPOTs
│   │   ├── MonthSection.tsx        # 🆕 Sección por mes
│   │   └── SpotDetail.tsx          # 🆕 Detalle de SPOT
│   │
│   ├── mint/
│   │   ├── MintModal.tsx           # 🆕 Modal de mint
│   │   ├── QRScanner.tsx           # 🆕 Escáner QR
│   │   ├── LinkInput.tsx           # 🆕 Input de link
│   │   ├── GeolocationButton.tsx   # 🆕 Botón geolocalización
│   │   ├── NFCButton.tsx           # 🆕 Botón NFC
│   │   └── CodeInput.tsx           # 🆕 Input de código
│   │
│   ├── event/
│   │   ├── EventCard.tsx           # 🆕 Tarjeta de evento
│   │   ├── EventForm.tsx           # 🆕 Formulario crear evento
│   │   └── EventFilters.tsx        # 🆕 Filtros de eventos
│   │
│   ├── profile/
│   │   ├── UserStats.tsx           # 🆕 Estadísticas usuario
│   │   └── WalletInfo.tsx          # 🆕 Info de wallet
│   │
│   ├── ConnectAccount.tsx          # ✅ Ya existe
│   ├── MobileMenu.tsx              # ✅ Ya existe (modificar)
│   └── UserInfo.tsx                # ✅ Ya existe
│
├── hooks/
│   ├── useSpotCollection.ts        # 🆕 Hook para SPOTs del usuario
│   ├── useMint.ts                  # 🆕 Hook para reclamar SPOT
│   ├── useEvents.ts                # 🆕 Hook para eventos
│   ├── useQRScanner.ts             # 🆕 Hook para QR
│   ├── useGeolocation.ts           # 🆕 Hook para geolocalización
│   └── useWallet.ts                # ✅ Ya existe
│
└── utils/
    ├── dateFormatter.ts            # 🆕 Formatear fechas
    ├── spotGrouping.ts             # 🆕 Agrupar SPOTs por mes/año
    └── colors.ts                   # 🆕 Constantes de colores
```

---

## 🚀 Rutas Propuestas (React Router)

```typescript
// App.tsx - Estructura de rutas
<Routes>
  <Route element={<AppLayout />}>
    {/* Páginas principales */}
    <Route path="/" element={<Home />} />
    <Route path="/mint" element={<Mint />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:eventId" element={<EventDetail />} />
    
    {/* Perfil y configuración */}
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/notifications" element={<Notifications />} />
    
    {/* Organizador */}
    <Route path="/create-event" element={<CreateEvent />} />
    <Route path="/my-events" element={<MyEvents />} />
    
    {/* Debug (desarrollo) */}
    <Route path="/debug" element={<Debugger />} />
    <Route path="/debug/:contractName" element={<Debugger />} />
  </Route>
</Routes>
```

---

## 📱 Navegación Mobile

### Bottom Navigation (Móvil)

Barra inferior fija con 5 iconos principales:

```
┌──────┬──────┬──────┬──────┬──────┐
│ Home │ Mint │Events│Search│Profile│
│  🏠  │  ⚡  │  📅  │  🔍  │  👤  │
└──────┴──────┴──────┴──────┴──────┘
```

**Componente**: `BottomNav.tsx`

**Mostrar solo en**: Móvil (< 1024px)

### Header (Desktop)

En desktop (> 1024px), mostrar navegación horizontal en header.

---

## 🎨 Componentes Clave a Crear

### 1. **SpotCard** - Tarjeta de SPOT individual

```tsx
interface SpotCardProps {
  spot: {
    id: string;
    name: string;
    date: Date;
    image: string;
    eventId: string;
  };
  onClick?: () => void;
}
```

**Diseño**:
- Badge circular con imagen
- Nombre del evento
- Fecha
- Badge "Verified"

**Colores**:
- Fondo: Blanco
- Borde: Morado claro (`border-spot-purple/20`)
- Hover: Amarillo (`hover:border-spot-yellow`)

---

### 2. **MonthSection** - Agrupar SPOTs por mes

```tsx
interface MonthSectionProps {
  month: string; // "Noviembre 2025"
  year: number;
  spots: Spot[];
}
```

**Diseño**:
- Header con mes/año y contador
- Grid de SpotCards debajo

---

### 3. **MintModal** - Modal para reclamar SPOT

Modal que se abre desde el botón "Mint" con opciones:
- QR Scanner
- Link Input
- Geolocation
- NFC
- Code Input

---

### 4. **BottomNav** - Navegación inferior móvil

Barra fija en la parte inferior con:
- Home
- Mint
- Events
- Search
- Profile

---

## 💡 Sugerencias Adicionales

### 1. **Sistema de Notificaciones**
- Notificaciones push para:
  - SPOT reclamado exitosamente
  - Nuevo evento de organizador seguido
  - Recordatorio de evento próximo (1 día antes)
  - Evento finalizado (última oportunidad para reclamar)

### 2. **Modo Oscuro**
- Futuro: Agregar toggle en Ajustes
- Colores invertidos manteniendo la paleta

### 3. **Filtros y Búsqueda**
- Filtros en Home:
  - Por año
  - Por mes
  - Por categoría (si se implementa)
- Búsqueda en eventos:
  - Por nombre
  - Por ubicación

### 4. **Social Features** (Futuro)
- Compartir SPOT en redes sociales
- Ver colección de otros usuarios (si permiten)
- Follow organizadores

### 5. **Gamificación**
- Badges especiales por hitos:
  - "Primer SPOT"
  - "10 SPOTs"
  - "50 SPOTs"
  - "Coleccionista del mes"
- Estadísticas visuales (gráficos)

### 6. **Accesibilidad**
- Soporte para lectores de pantalla
- Contraste adecuado (negro sobre blanco)
- Tamaños de fuente configurables
- Navegación por teclado

### 7. **Performance**
- Lazy loading de imágenes
- Virtual scrolling para listas largas
- Caché de SPOTs del usuario
- Optimización de imágenes (WebP)

### 8. **PWA (Progressive Web App)**
- Instalable en móvil
- Funciona offline (cache de SPOTs)
- Service Worker para sincronización

---

## 📐 Breakpoints Sugeridos (Tailwind)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Móvil grande
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop pequeño
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Desktop grande
    },
  },
}
```

**Estrategia**:
- **Móvil** (< 640px): Diseño base, stack vertical
- **Tablet** (640px - 1024px): Grid de 2 columnas
- **Desktop** (> 1024px): Grid de 3-4 columnas, sidebar opcional

---

## 🔄 Estados de Carga y Errores

### Estados Importantes:

1. **Cargando SPOTs**:
   - Skeleton loaders
   - Spinner con mensaje "Cargando tu colección..."

2. **Sin SPOTs**:
   - Ilustración/emoji
   - Mensaje: "Aún no tienes SPOTs"
   - Botón "Explorar eventos"

3. **Error al cargar**:
   - Mensaje de error
   - Botón "Reintentar"

4. **Error al reclamar**:
   - Toast/notificación con mensaje específico
   - Botón "Reintentar"

---

## 🎯 Prioridades de Implementación

### Fase 1 (MVP):
1. ✅ Home con SPOTs agrupados por mes/año
2. ✅ Perfil básico
3. ✅ Mint modal con QR y Link
4. ✅ Crear evento básico
5. ✅ Conectar wallet

### Fase 2:
1. Geolocalización
2. Buscar eventos
3. Notificaciones
4. Ajustes

### Fase 3:
1. NFC
2. Social features
3. PWA
4. Modo oscuro

---

## 📝 Notas de Implementación

### Mobile-First CSS:

```tsx
// ❌ Desktop-first (evitar)
<div className="p-8 md:p-4">

// ✅ Mobile-first (correcto)
<div className="p-4 md:p-6 lg:p-8">
```

### Componentes Reutilizables:

- Crear componentes pequeños y reutilizables
- Usar TypeScript para tipos
- Mantener lógica separada de presentación

### Testing:

- Probar en dispositivos reales
- Usar DevTools de Chrome para emular móviles
- Probar diferentes tamaños de pantalla

---

**¿Listo para implementar?** Cuando decidas comenzar, puedo ayudarte a crear cada componente paso a paso, empezando por el Home con SPOTs agrupados por mes/año.

