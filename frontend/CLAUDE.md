# Frontend — Lineamientos técnicos

Next.js 16.2.3 + React 18 + TypeScript 5 + Tailwind CSS 3.  
Deploy: Vercel (auto-deploy desde `main`).

## Estructura de directorios

```
frontend/
├── app/
│   ├── (public)/              # Layout público (Navbar + Footer)
│   │   ├── page.tsx           # Home
│   │   ├── eventos/           # Calendario público de eventos
│   │   ├── galeria/           # Galería (mock "próximamente")
│   │   ├── nosotros/          # Sobre el club
│   │   ├── contacto/          # Formulario de contacto
│   │   ├── politica/
│   │   └── terminos/
│   ├── (auth)/                # Páginas de auth sin layout privado
│   │   ├── login/
│   │   ├── registro/
│   │   ├── verificacion/
│   │   └── resend-confirmation/
│   ├── app/                   # Rutas privadas protegidas (/app/*)
│   │   ├── dashboard/
│   │   ├── reservas/          # Sistema de reservas (🚧 en desarrollo)
│   │   ├── admin/             # Panel de administración (⏳ pendiente)
│   │   └── complete-profile/  # Completar perfil (flujo obligatorio)
│   ├── auth/callback/         # Callback OAuth Supabase
│   ├── documentacion-socios/  # Docs para socios
│   ├── layout.tsx             # Root layout con providers + GA
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                    # Primitivos shadcn/ui (Radix UI)
│   ├── auth/                  # Formularios de auth
│   ├── profile/               # Gestión de perfil
│   ├── Dashboard/             # Componentes del panel privado
│   ├── Navbar/                # Navbar responsive
│   ├── Footer/
│   ├── dialogs/               # Modales globales
│   ├── eventos/               # Componentes de eventos
│   └── RedirectMsj/           # Componentes de estado/redirección
├── config/
│   ├── routes.ts              # ⚠️ FUENTE DE VERDAD de todas las rutas
│   └── sidebar-config.tsx     # Configuración del sidebar privado
├── stores/
│   ├── auth/                  # Store Zustand de autenticación
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   ├── actions.ts
│   │   ├── server.ts          # Funciones solo servidor
│   │   └── clients.ts         # Cliente Supabase browser
│   └── messageDialogStore.ts  # Store para diálogos globales
├── hooks/
│   ├── useRouting.ts          # Navegación y redirección
│   └── useMessageDialog.ts    # Diálogos modales globales
├── lib/
│   ├── route-utils.ts         # isPrivateRoute, isAdminRoute, canAccessRoute, etc.
│   ├── evento-images.ts       # Helpers para imágenes de eventos
│   └── utils.ts               # cn() y otros helpers Tailwind
├── types/
│   ├── api.ts                 # Tipos base de respuestas API
│   ├── models/                # user.ts, reservation.ts, schedule.ts, event.ts, club.ts
│   ├── forms/                 # auth-form.ts, profile-form.ts, reservation-form.ts
│   ├── api-responses/         # profile.ts, user.ts
│   ├── sidebar.ts             # SidebarSection, SidebarConfig, SidebarSubmenu
│   └── evento-historico.ts    # Tipo para eventos históricos del club
├── data/                      # Datos estáticos (eventos históricos, etc.)
├── assets/
│   ├── eventos/               # Imágenes de eventos históricos
│   └── images/                # Imágenes generales
├── public/images/             # Imágenes públicas (servidas directamente)
├── constants/                 # Constantes de la aplicación
├── middleware.ts              # Middleware Next.js (Supabase SSR auth)
├── next.config.mjs            # Config Next.js + security headers + CSP
├── tailwind.config.ts
└── tsconfig.json
```

## Reglas de navegación — OBLIGATORIO

### Rutas: siempre usar `@/config/routes.ts`

```typescript
// ✅ HACER
import { ROUTES } from '@/config/routes'
<Link href={ROUTES.AUTH.LOGIN}>Iniciar sesión</Link>
<Link href={ROUTES.DASHBOARD}>Dashboard</Link>

// ❌ NO HACER — rutas hardcodeadas
<Link href="/login">Iniciar sesión</Link>
<Link href="/app/dashboard">Dashboard</Link>
```

### Validación de rutas: siempre usar `@/lib/route-utils.ts`

```typescript
import { isPrivateRoute, isAdminRoute, isAuthRoute, canAccessRoute } from '@/lib/route-utils'

// ❌ NO HACER — validación manual duplicada
const isPrivate = pathname.startsWith('/app/') || pathname.startsWith('/dashboard')
```

## Autenticación (Supabase SSR)

El `middleware.ts` de Next.js intercepta todas las rutas y valida la sesión Supabase.  
Callback OAuth: `/auth/callback` — configurado en Supabase Dashboard.

```typescript
// Hooks disponibles (NO duplicar)
import { useAuth, useRequireAuth, useAuthRedirect } from '@/stores/auth'

// Server components: usar stores/auth/server.ts
// Client components: usar stores/auth/hooks.ts y stores/auth/store.ts
```

Flujo obligatorio: registro → verificar email → completar perfil (`/app/complete-profile`) → dashboard.

## Sistema de notificaciones

**Toast simple** (mensajes no críticos):
```typescript
import { toast } from 'sonner'
toast.success('Reserva creada')
toast.error('Error al procesar')
```

**Diálogo modal** (confirmaciones importantes, errores críticos):
```typescript
import { useMessageDialog } from '@/hooks/useMessageDialog'
const { showDialog } = useMessageDialog()
showDialog({ title: '...', message: '...', type: 'warning', buttonOne: { ... } })
```

## Sidebar privado

Configurar en `@/config/sidebar-config.tsx` — no modificar el componente directamente.

```typescript
// Ítem actual (según especificación de reservas):
// - Dashboard
// - Reservas        → /app/reservas  (TODO el flujo en una sola ruta, sin /nueva)
// - Administración
//   └── Registro Piscina  → visible para TREASURER y ADMIN
```

Tipos del sidebar: `@/types/sidebar.ts` (SidebarSection, SidebarSubmenu, SidebarConfig).

## Colores del club (Tailwind)

```typescript
// tailwind.config.ts
primary: { 500: '#14b8a6', 600: '#0d9488' }  // Turquesa del club
accent:  { 400: '#facc15', 500: '#eab308' }   // Amarillo del logo
ocean:   { 500: '#0ea5e9', 600: '#0284c7' }   // Azules del mar de Chiloé

// Clases utilitarias personalizadas
.bg-club-gradient
.text-club-shadow
.border-club-gradient
```

## Patrones de componentes

```typescript
// ✅ Arrow functions con props tipadas
interface ComponentProps { prop1: string; prop2?: number }
const ComponentName = ({ prop1, prop2 }: ComponentProps) => { ... }
export { ComponentName }  // Named export

// ✅ Formularios: React Hook Form + Yup (auth) o Zod (resto)
const { register, handleSubmit, formState } = useForm({ resolver: yupResolver(schema) })

// ✅ Imagen: siempre <Image> de next/image (nunca <img>)
<Image src="..." alt="..." width={...} height={...} priority />
```

## Estructura de tipos — usar antes de crear

Antes de definir un tipo nuevo, buscar en `types/`:
- `types/models/` — entidades de dominio (User, Reservation, SwimmingSchedule, Event, Club)
- `types/forms/` — formularios (auth, profile, reservation)
- `types/api-responses/` — respuestas específicas de API
- `types/api.ts` — tipos base (ApiResponse, etc.)

## Sistema de reservas (en desarrollo — Fase 3)

Toda la UI de reservas vive en **`/app/reservas`** (una sola ruta, sin `/nueva`).

Panel de usuario incluye:
- Calendario mensual con estados por día (verde=reservado, blanco=libre, rojo=cancelado)
- Botón "Liberar cupos" — selección múltiple de sesiones futuras + modal de confirmación
- Botón "Nueva reserva" — solo habilitado cuando el admin abrió el mes siguiente
- Recuadro con total a transferir (sesiones × precio − reembolsos por cancelación admin)

Panel admin "Registro Piscina" (`/app/admin/registro-piscina`, roles TREASURER/ADMIN):
- Calendario de cupos x/y por día
- Apertura del mes siguiente (checkboxes por día + modal confirmación)
- Cancelación de días (registra reembolsos en usuarios afectados)

## Security headers

Configurados en `next.config.mjs`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- CSP configurada para Supabase, Google Analytics, Google Fonts

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=https://api.aguasabiertaschiloe.cl  # (o localhost:PORT en dev)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=...
```

## SEO

Metadata template en root layout: `'%s | CAAChiloé'`.  
`sitemap.ts` y `robots.ts` en la raíz de `app/`.  
`openGraph.locale: 'es_CL'`, `url: 'https://www.aguasabiertaschiloe.cl'`.
