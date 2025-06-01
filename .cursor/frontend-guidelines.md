# Lineamientos Técnicos - Frontend

## Configuración Inicial del Proyecto

### 1. Estructura de Monorepo
```
aachiloe/
├── api/                    # API existente (Express + Prisma)
├── frontend/               # Nueva app Next.js
├── shared/                 # Tipos y utilidades compartidas
└── .cursor/               # Documentación del proyecto
```

### 2. Tecnologías y Versiones Específicas
- **Next.js**: 14.x con App Router
- **React**: 18.x
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **shadcn/ui**: Última versión
- **Zustand**: 4.x
- **Supabase**: @supabase/supabase-js v2

## Configuración de Autenticación

### Supabase Auth Setup
1. **Variables de Entorno Requeridas**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **OAuth con Google**:
   - Configurar en Supabase Dashboard
   - Redirect URLs para desarrollo y producción
   - Scopes necesarios: email, profile

## Arquitectura del Frontend

### 1. App Router Structure
```
app/
├── (public)/              # Rutas públicas
│   ├── page.tsx          # Home
│   ├── eventos/          # Calendario público
│   ├── galeria/          # Galería de fotos (MOCKS TEMPORALES)
│   ├── nosotros/         # Sobre nosotros
│   └── contacto/         # Contacto
├── (auth)/               # Rutas de autenticación
│   ├── login/
│   └── registro/
├── auth/                 # Supabase auth callbacks
├── (private)/            # Rutas privadas - PRIORIDAD ALTA
│   ├── dashboard/        # Panel usuario
│   ├── reservas/         # Gestión reservas - CRÍTICO
│   └── admin/           # Panel admin - CRÍTICO
├── globals.css
├── layout.tsx
└── not-found.tsx
```

### 2. Componentes Reutilizables
```
components/
├── ui/                   # shadcn/ui components
├── layout/              # Header, Footer, Navigation
├── auth/                # Componentes de autenticación - PRIORIDAD ALTA
├── calendar/            # Componentes de calendario
├── gallery/             # Componentes de galería (MOCKS)
├── reservations/        # Componentes de reservas - CRÍTICO
├── admin/              # Componentes de administración - CRÍTICO
├── providers/           # Providers (e.g. ThemeProvider)
├── Navbar/
└── Footer/
```

### 3. Estado Global con Zustand
```
stores/
├── auth/                # Estado de autenticación - PRIORIDAD ALTA
├── user-profile/        # Datos del usuario
├── reservations-store.ts # Estado de reservas - CRÍTICO (Assuming this will be created)
└── ui-store.ts          # Estado de UI (modals, loading) (Assuming this will be created)
```

## Integración con APIs

### 1. Cliente API para Backend Existente - CRÍTICO
```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  // Métodos CRÍTICOS para reservas
  async getAvailableSlots(date: string): Promise<SwimmingSchedule[]>
  async createReservation(data: CreateReservationData): Promise<Reservation>
  async getUserReservations(userId: number): Promise<Reservation[]>
  async cancelReservation(reservationId: number): Promise<void>
  
  // Métodos para administración
  async confirmReservation(reservationId: number): Promise<void>
  async getReservationsByDate(date: string): Promise<Reservation[]>
}
```

## Sistema de Reservas - Implementación Crítica 🚀

### 1. Componentes Principales de Reservas
```typescript
// components/reservations/
├── AvailableSlotsCalendar.tsx    # Calendario con slots disponibles
├── ReservationForm.tsx           # Formulario de nueva reserva
├── ReservationsList.tsx          # Lista de reservas del usuario
├── ReservationCard.tsx           # Card individual de reserva
├── SlotAvailability.tsx          # Indicador de disponibilidad
└── ReservationConfirmation.tsx   # Modal de confirmación
```

### 2. Store de Reservas - Zustand
```typescript
interface ReservationsState {
  // Estado
  reservations: Reservation[];
  availableSlots: SwimmingSchedule[];
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;

  // Acciones CRÍTICAS
  fetchAvailableSlots: (date: string) => Promise<void>;
  createReservation: (data: CreateReservationData) => Promise<void>;
  fetchUserReservations: () => Promise<void>;
  cancelReservation: (id: number) => Promise<void>;
  
  // Validaciones
  validateReservation: (data: CreateReservationData) => ValidationResult;
  checkSlotAvailability: (scheduleId: number, date: string) => boolean;
}
```

## Configuración de SEO

### 1. Metadata Dinámico
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Club de Aguas Abiertas Chiloé',
    default: 'Club de Aguas Abiertas Chiloé'
  },
  description: 'Club oficial de natación en aguas abiertas de Chiloé',
  keywords: ['natación', 'aguas abiertas', 'chiloé', 'club'],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://www.aguasabiertaschiloe.cl',
    siteName: 'Club de Aguas Abiertas Chiloé'
  }
};
```

## Configuración de Tailwind y shadcn/ui

### 1. Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  //...
  }
};
```

## Deployment

### 1. Netlify Configuration
```toml
# netlify.toml
[build]
  base = "frontend/"
  publish = "frontend/.next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

# Redirects para SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API proxy para desarrollo
[[redirects]]
  from = "/api/*"
  to = "http://localhost:3001/api/:splat"
  status = 200
  force = false
  conditions = {Role = ["admin"]}

# Headers de seguridad
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 2. Environment Variables en Netlify
```bash
# Variables a configurar en Netlify Dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://aguasabiertaschiloe.cl
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
``` 