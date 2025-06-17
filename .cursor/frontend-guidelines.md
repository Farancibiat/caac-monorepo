# Lineamientos Técnicos - Frontend

## Configuración Inicial del Proyecto

### 1. Stack Tecnológico Actual
```json
{
  "framework": "Next.js 14.2.29",
  "react": "18.x",
  "typescript": "5.x",
  "styling": "Tailwind CSS 3.4.1",
  "ui_library": "shadcn/ui + Radix UI",
  "state_management": "Zustand 5.0.5",
  "auth": "Supabase Auth 2.49.8",
  "forms": "React Hook Form 7.57.0 + Yup 1.6.1",
  "icons": "Lucide React 0.511.0",
  "notifications": "Sonner 2.0.4"
}
```

### 2. Estructura de Directorios
```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── (public)/          # Rutas públicas con layout compartido
│   │   ├── page.tsx       # Home page
│   │   ├── eventos/       # Calendario público de eventos
│   │   ├── galeria/       # Galería de fotos (en desarrollo)
│   │   ├── nosotros/      # Información del club
│   │   └── contacto/      # Formulario de contacto
│   ├── (auth)/            # Rutas de autenticación
│   │   ├── login/         # Página de login
│   │   ├── registro/      # Página de registro
│   │   ├── verificacion/  # Verificación de email
│   │   └── resend-confirmation/ # Reenvío de confirmación
│   ├── app/               # Rutas privadas protegidas (prefijo /app/)
│   │   ├── dashboard/     # Panel principal del usuario
│   │   ├── reservas/      # Gestión de reservas (CRÍTICO)
│   │   ├── admin/         # Panel de administración
│   │   ├── complete-profile/ # Completar perfil obligatorio
│   │   └── settings/      # Configuraciones de usuario
│   ├── auth/              # Callbacks de Supabase
│   │   └── callback/      # Manejo de OAuth callbacks
│   ├── globals.css        # Estilos globales + Tailwind
│   ├── layout.tsx         # Layout raíz con providers
│   └── not-found.tsx      # Página 404 personalizada
├── components/            # Componentes reutilizables
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Componentes de autenticación
│   ├── profile/          # Componentes de perfil de usuario
│   ├── Dashboard/        # Componentes del dashboard privado
│   ├── Navbar/           # Navegación principal responsive
│   ├── Footer/           # Footer del sitio
│   └── RedirectMsj/      # Componente de mensajes de redirección
├── config/               # Configuraciones centralizadas
│   ├── routes.ts         # ✅ Configuración centralizada de rutas
│   └── sidebar-config.tsx # ✅ Configuración del sidebar privado
├── stores/               # Gestión de estado con Zustand
│   ├── auth/             # Store de autenticación (CRÍTICO)
│   └── messageDialogStore.ts # Store para diálogos globales
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y helpers
│   └── route-utils.ts    # ✅ Utilidades centralizadas de rutas
├── types/                # Definiciones de tipos TypeScript
│   └── sidebar.ts        # ✅ Tipos para configuración del sidebar
├── constants/            # Constantes de la aplicación
└── middleware.ts         # Middleware de Next.js para auth
```

## Arquitectura del Frontend

### 1. App Router de Next.js 14
- **Route Groups**: Uso de `(public)`, `(auth)`, `app/` para organización lógica
- **Layouts anidados**: Cada grupo tiene su propio layout
- **Server Components por defecto**: Client Components marcados explícitamente
- **Metadata API**: SEO optimizado con metadata dinámico

### 2. Sistema de Autenticación
```typescript
// Arquitectura separada cliente/servidor
stores/auth/
├── index.ts           # Exports para componentes cliente
├── server.ts          # Funciones servidor (Server Components)
├── store.ts           # Store Zustand principal
├── types.ts           # Tipos TypeScript
├── hooks.ts           # Hooks especializados
├── actions.ts         # Server Actions
└── clients.ts         # Cliente Supabase browser
```

**Características implementadas**:
- ✅ OAuth con Google
- ✅ Email/Password authentication
- ✅ Gestión automática de sesiones
- ✅ Protección de rutas con middleware
- ✅ Redirección automática post-login
- ✅ Completar perfil obligatorio
- ✅ Manejo robusto de errores

### 3. Gestión de Estado
- **Zustand**: Store principal para autenticación
- **React Hook Form**: Manejo de formularios
- **Server State**: Supabase realtime subscriptions (futuro)
- **UI State**: Store separado para estado de UI (sidebar, modales)

### 4. Sistema de Rutas y Navegación
```typescript
// ✅ USAR UTILIDADES CENTRALIZADAS - No duplicar validaciones manuales
import { isPrivateRoute, isAdminRoute, canAccessRoute } from '@/lib/route-utils'

// ❌ NO HACER - Validación manual duplicada
const isPrivateRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/reservas')

// ✅ HACER - Usar funciones centralizadas
const showPrivateContent = isPrivateRoute(pathname)
const showAdminFeatures = isAdminRoute(pathname)
```

**Funciones disponibles en `@/lib/route-utils`:**
- `isPrivateRoute()` - Rutas que requieren autenticación
- `isAuthRoute()` - Rutas de login/registro
- `isPublicRoute()` - Rutas públicas
- `isAdminRoute()` - Rutas de administración
- `canAccessRoute()` - Validación completa con roles

## ✅ CONFIGURACIÓN CENTRALIZADA DE RUTAS Y NAVEGACIÓN

### 1. Configuración de Rutas (`@/config/routes.ts`)
```typescript
// ✅ OBLIGATORIO - Usar configuración centralizada para todas las rutas
import { ROUTES } from '@/config/routes'

// ✅ HACER - Links con configuración centralizada
<Link href={ROUTES.AUTH.LOGIN}>Iniciar Sesión</Link>
<Link href={ROUTES.DASHBOARD}>Dashboard</Link>
<Link href={ROUTES.RESERVATIONS}>Reservas</Link>

// ❌ NO HACER - Links hardcodeados
<Link href="/login">Iniciar Sesión</Link>
<Link href="/app/dashboard">Dashboard</Link>
<Link href="/app/reservas">Reservas</Link>
```



### 2. Configuración del Sidebar (`@/config/sidebar-config.tsx`)
```typescript
// ✅ OBLIGATORIO - Usar configuración centralizada para el sidebar
import { sidebarConfig } from '@/config/sidebar-config'

// ✅ HACER - Configuración escalable con roles y submenús
export const sidebarConfig: SidebarConfig = {
  dashboard: {
    title: "Dashboard",
    base: "/app/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "" // Item simple sin submenús
  },
  
  reservas: {
    title: "Reservas",
    base: "/app/reservas",
    icon: <Calendar className="h-5 w-5" />,
    submenus: [
      { label: "Mis Reservas", path: "" },
      { label: "Nueva Reserva", path: "/nueva" }
    ]
  },

  administracion: {
    title: "Administración",
    base: "/app/admin",
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN', 'TREASURER'], // Control de acceso por roles
    submenus: [
      { label: "Usuarios", path: "/usuarios" },
      { label: "Configuración", path: "/config" }
    ]
  }
}
```

**Características del sistema de sidebar:**
- ✅ **Menús colapsables**: Submenús expandibles con animaciones
- ✅ **Control de roles**: Filtrado automático por permisos de usuario
- ✅ **Configuración externa**: Fácil mantenimiento y escalabilidad
- ✅ **Auto-expansión**: La sección activa se expande automáticamente
- ✅ **Tipos TypeScript**: Completamente tipado con interfaces

**Tipos disponibles en `@/types/sidebar.ts`:**
```typescript
export interface SidebarSubmenu {
  label: string;
  path: string;
  roles?: AuthRole[];
}

export interface SidebarSection {
  title: string;
  base: string;
  icon: React.ReactNode;
  roles?: AuthRole[];
  submenus?: SidebarSubmenu[];
  path?: string; // Para items simples sin submenús
}

export interface SidebarConfig {
  [key: string]: SidebarSection;
}
```

### 3. Reglas de Uso Obligatorias

**Para Links y Navegación:**
- ✅ **SIEMPRE** importar `ROUTES` de `@/config/routes`
- ✅ **NUNCA** usar rutas hardcodeadas en componentes
- ✅ **VALIDAR** rutas usando `@/lib/route-utils`
- ✅ **MANTENER** consistencia en toda la aplicación

**Para Configuración del Sidebar:**
- ✅ **MODIFICAR** solo `@/config/sidebar-config.tsx` para cambios de menú
- ✅ **USAR** roles para controlar acceso a secciones
- ✅ **SEGUIR** la estructura de tipos definida
- ✅ **TESTEAR** cambios con diferentes roles de usuario


## Configuración de Tecnologías

### 1. Tailwind CSS + Sistema de Colores
```typescript
// Colores oficiales del Club de Aguas Abiertas Chiloé
colors: {
  primary: {    // Turquesa del club
    500: '#14b8a6',
    600: '#0d9488',
    // ... resto de escala
  },
  accent: {     // Amarillo vibrante del logo
    400: '#facc15',
    500: '#eab308',
    // ... resto de escala
  },
  ocean: {      // Azules del mar de Chiloé
    500: '#0ea5e9',
    600: '#0284c7',
    // ... resto de escala
  }
}
```

**Clases utilitarias personalizadas**:
- `.bg-club-gradient`: Gradiente oficial del club
- `.text-club-shadow`: Sombra de texto para títulos
- `.border-club-gradient`: Bordes con gradiente

### 2. shadcn/ui Configuration
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 3. TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/stores/*": ["./stores/*"],
      "@/app/*": ["./app/*"],
      "@/types/*": ["./types/*"],
      "@/config/*": ["./config/*"]
    }
  }
}
```

## Estructura de Tipos TypeScript

### 1. Organización de `/types`
```
types/
├── api.ts                 # Tipos base para respuestas de API
├── models/               # Modelos de datos del dominio
│   ├── user.ts          # Usuario, ProfileStatus
│   ├── reservation.ts   # Reservation, ReservationStatus, PaymentRecord
│   ├── schedule.ts      # SwimmingSchedule, ScheduleAvailability
│   ├── event.ts         # Event, EventDistance, EventFilters
│   ├── club.ts          # Club, ClubSimple
│   └── email.ts         # ReservationEmailDetails
├── forms/               # Tipos para formularios específicos
│   ├── auth-form.ts     # LoginFormData, RegisterFormData
│   ├── profile-form.ts  # ProfileFormData, ProfileFormProps
│   ├── reservation-form.ts # CreateReservationFormData
│   └── admin-forms.ts   # ClubFormData, CreateUserFormData
├── api-responses/       # Tipos para respuestas específicas de API
│   ├── profile.ts       # ProfileApiData, UpdateProfileResponseData
│   └── user.ts          # UserWithReservations
└── sidebar.ts           # ✅ Tipos para configuración del sidebar
```

**⚠️ IMPORTANTE**: Usar tipos existentes antes de crear nuevos. Centralizar interfaces relacionadas en archivos temáticos.

## Componentes y Hooks Globales Existentes

### 1. GlobalMessageDialog
```typescript
// ✅ YA EXISTE - No duplicar
import { useMessageDialog } from '@/hooks/useMessageDialog'

// Uso para mostrar diálogos modales globales
const { showDialog } = useMessageDialog()

showDialog({
  title: "Confirmar acción",
  message: "¿Estás seguro?",
  type: "warning",
  buttonOne: { text: "Confirmar", onClick: handleConfirm },
  buttonTwo: { text: "Cancelar" }
})
```

### 2. Toast Notifications (Sonner)
```typescript
// ✅ YA CONFIGURADO - Para mensajes simples
import { toast } from 'sonner'

// Tipos de toast disponibles
toast.success('Operación exitosa')
toast.error('Error al procesar')
toast.warning('Advertencia importante')
toast.info('Información relevante')

// Toast con descripción
toast.success('Reserva creada', {
  description: 'Tu reserva ha sido confirmada para el 15 de marzo'
})

// Toast con acción
toast.error('Error de conexión', {
  description: 'No se pudo conectar al servidor',
  action: {
    label: 'Reintentar',
    onClick: () => retryConnection()
  }
})
```

### 3. Hooks Disponibles
```typescript
// ✅ YA EXISTEN - No duplicar
import { useRouting } from '@/hooks/useRouting'        // Navegación y redirección
import { useMessageDialog } from '@/hooks/useMessageDialog' // Diálogos globales
import { useAuth, useRequireAuth, useAuthRedirect } from '@/stores/auth' // Autenticación
```

**Cuándo usar cada uno:**
- **Toast (Sonner)**: Mensajes simples, confirmaciones, errores no críticos
- **GlobalMessageDialog**: Confirmaciones importantes, errores críticos, formularios en modal

## Patrones de Desarrollo

### 1. Componentes React
```typescript
// ✅ PATRÓN RECOMENDADO: Arrow functions
const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  return <div>Content</div>
}

// ✅ Props tipadas obligatorias
interface ComponentProps {
  prop1: string
  prop2?: number
}

// ✅ Exports nombrados preferidos
export { ComponentName }
```

### 2. Manejo de Formularios
```typescript
// Patrón estándar con React Hook Form + Yup
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
})
```

### 3. Gestión de Estado
```typescript
// Store Zustand con tipos estrictos
interface AuthState {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  // ... implementación
}))
```

### 4. Server Actions
```typescript
// Server Actions para operaciones del servidor
'use server'

export const signInWithGoogle = async () => {
  const supabase = await supabaseServer()
  // ... lógica del servidor
}
```

## Integración con APIs y Servicios

### 1. Supabase Configuration
```typescript
// Variables de entorno requeridas
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

// Cliente separado para browser y servidor
export const supabaseClient = createBrowserClient(...)
export const supabaseServer = async () => createServerClient(...)
```

### 2. Middleware de Autenticación
```typescript
// Protección automática de rutas
export const middleware = async (request: NextRequest) => {
  // Validación de sesión
  // Redirección automática
  // Headers de seguridad
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)',]
}
```

## Configuración de SEO y Performance

### 1. Metadata Dinámico
```typescript
export const metadata: Metadata = {
  title: {
    template: '%s | CAAChiloé',
    default: 'Club de Aguas Abiertas Chiloé'
  },
  description: 'Club de Aguas Abiertas Chiloé...',
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://www.aguasabiertaschiloe.cl'
  }
}
```

### 2. Optimización de Imágenes
```typescript
// Next.js Image component obligatorio
<Image
  src="/assets/logo.png"
  alt="Club de Aguas Abiertas Chiloé"
  width={320}
  height={320}
  priority // Para imágenes above-the-fold
  sizes="(max-width: 640px) 144px, 192px"
/>
```

### 3. Headers de Seguridad
```javascript
// next.config.mjs
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Content-Security-Policy', value: '...' }
    ]
  }]
}
```

## Funcionalidades Implementadas

### 1. Sistema de Autenticación ✅
- Login/Registro con email y Google OAuth
- Verificación de email obligatoria
- Protección de rutas automática
- Completar perfil obligatorio
- Manejo de errores robusto

### 2. Navegación Responsive ✅
- Navbar adaptativo con detección de scroll
- Sidebar colapsable en rutas privadas con menús anidados
- Menú móvil con animaciones
- Breadcrumbs automáticos

### 3. Sistema de Notificaciones ✅
- Toast notifications con Sonner
- Diálogos modales globales
- Mensajes de redirección informativos
- Estados de carga consistentes

### 4. Páginas Públicas ✅
- Home page con hero section
- Página de eventos (mock data)
- Galería en desarrollo
- Información del club
- Formulario de contacto

### 5. Dashboard Privado ✅
- Panel de usuario personalizado
- Gestión de reservas (en desarrollo)
- Panel de administración con control de roles
- Configuraciones de perfil
- Sidebar escalable con submenús colapsables

## Funcionalidades en Desarrollo

### 1. Sistema de Reservas 🚧
- Calendario de disponibilidad
- Reserva de horarios de piscina
- Gestión de pagos
- Notificaciones automáticas

### 2. Panel de Administración 🚧
- Gestión de usuarios
- Configuración de horarios
- Reportes y estadísticas
- Gestión de eventos

### 3. Galería de Fotos 🚧
- Upload de imágenes
- Organización por eventos
- Descarga gratuita para socios
- Optimización automática

## Deployment y Configuración

### 1. Vercel Configuration
```javascript
// next.config.mjs optimizado para producción
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Configuración personalizada
  }
}
```

### 2. Variables de Entorno
```bash
# Requeridas para producción
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
```

### 3. Analytics y Monitoreo
- Google Analytics 4 integrado
- Vercel Analytics habilitado
- Error boundaries implementados
- Performance monitoring activo
