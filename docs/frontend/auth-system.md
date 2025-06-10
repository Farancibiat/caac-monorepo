# 🔐 Sistema de Autenticación - Guía Completa

## 📋 Tabla de Contenidos

1. [Resumen](#resumen)
2. [Arquitectura](#arquitectura)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Uso en Componentes Cliente](#uso-en-componentes-cliente)
5. [Uso en Server Components/Actions](#uso-en-server-componentsactions)
6. [Protección de Rutas](#protección-de-rutas)
7. [Middleware de Autenticación](#middleware-de-autenticación)
8. [Manejo de Errores](#manejo-de-errores)
9. [Debug y Troubleshooting](#debug-y-troubleshooting)
10. [Ejemplos Prácticos](#ejemplos-prácticos)

## 🎯 Resumen

Sistema de autenticación construido con **Zustand** + **Supabase** que proporciona:

- ✅ Autenticación con Google OAuth
- ✅ Login/Register con email/password  
- ✅ Gestión automática de sesiones
- ✅ Protección de rutas
- ✅ Middleware de Next.js
- ✅ Sincronización automática del estado
- ✅ Manejo robusto de errores

## 🏗️ Arquitectura

```
stores/auth/
├── index.ts           # Exports para componentes cliente
├── server.ts          # Funciones servidor (Server Components/Actions)
├── store.ts           # Store Zustand principal
├── types.ts           # Tipos TypeScript
├── hooks.ts           # Hooks especializados
├── actions.ts         # Server Actions
├── clients.ts         # Cliente Supabase browser
└── debug.ts           # Utilidades de debug
```

### **Separación Cliente/Servidor**

```tsx
// ✅ CLIENTE - Componentes React
import { useAuth, useAuthStore, supabaseClient } from '@/stores/auth'

// ✅ SERVIDOR - Server Components/Actions  
import { supabaseServer, getUser, requireAuth } from '@/stores/auth/server'
```

## 🚀 Instalación y Configuración

### 1. Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Configurar AuthProvider

```tsx
// app/layout.tsx
import { AuthProvider } from '@/components/auth/auth-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## 💻 Uso en Componentes Cliente

### Hook Principal `useAuth()`

```tsx
'use client'

import { useAuth, useAuthStore } from '@/stores/auth'

export const MyComponent = () => {
  // 🔍 Estado de autenticación
  const { 
    user,           // Usuario actual
    session,        // Sesión de Supabase  
    isAuthenticated,// Boolean si está autenticado
    loading,        // Estado de carga
    error          // Errores de autenticación
  } = useAuth()

  // 🎯 Acciones de autenticación
  const { 
    signInWithGoogle,    // Login con Google
    signInWithEmail,     // Login con email/password
    signUp,             // Registro
    signOut            // Logout
  } = useAuthStore()

  if (loading) return <div>Cargando...</div>
  
  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={signInWithGoogle}>
          Login con Google
        </button>
        <button onClick={() => signInWithEmail('user@email.com', 'password')}>
          Login con Email
        </button>
        <button onClick={() => signUp('user@email.com', 'password')}>
          Registrarse
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1>¡Bienvenido {user?.email}!</h1>
      <button onClick={signOut}>Cerrar Sesión</button>
    </div>
  )
}
```

### Hook para Rutas Protegidas `useRequireAuth()`

```tsx
'use client'

import { useRequireAuth } from '@/stores/auth'
import { redirect } from 'next/navigation'

export const ProtectedComponent = () => {
  const { user, loading, shouldRedirect } = useRequireAuth()

  if (loading) return <div>Verificando autenticación...</div>
  if (shouldRedirect) redirect('/login')

  return (
    <div>
      <h1>Contenido Protegido</h1>
      <p>Usuario: {user?.email}</p>
    </div>
  )
}
```

## 🖥️ Uso en Server Components/Actions

### Server Component

```tsx
// app/dashboard/page.tsx
import { getUser, requireAuth } from '@/stores/auth/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Opción 1: Verificar si hay usuario (puede ser null)
  const user = await getUser()
  if (!user) redirect('/login')

  // Opción 2: Requerir autenticación (lanza error si no hay)
  const authenticatedUser = await requireAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido {user.email}</p>
    </div>
  )
}
```

### Server Action

```tsx
'use server'

import { requireAuth } from '@/stores/auth/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  // Verificar autenticación
  const user = await requireAuth()
  
  const name = formData.get('name') as string
  
  // Lógica de actualización...
  
  revalidatePath('/profile')
}
```

## 🛡️ Protección de Rutas

### Componente ProtectedRoute

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function PrivatePage() {
  return (
    <ProtectedRoute 
      fallback={<div>Cargando...</div>}
      redirectTo="/login"
    >
      <h1>Contenido Privado</h1>
    </ProtectedRoute>
  )
}
```

### Middleware Automático

El middleware protege automáticamente estas rutas:
- `/dashboard/*`
- `/reservas/*` 
- `/admin/*`

Y redirige rutas de auth si ya está logueado:
- `/login`
- `/registro`

## 🔧 Middleware de Autenticación

```typescript
// middleware.ts (configurado automáticamente)
export const middleware = async (request: NextRequest) => {
  // ✅ Protege rutas automáticamente
  // ✅ Maneja redirecciones
  // ✅ Limpia cookies en errores
  // ✅ Logs detallados
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}
```

## ❌ Manejo de Errores

### Errores Automáticos en el Store

```tsx
const { error } = useAuth()

if (error) {
  return <div className="error">Error: {error}</div>
}
```

### Manejo Manual de Errores

```tsx
const { signInWithEmail } = useAuthStore()

const handleLogin = async () => {
  try {
    await signInWithEmail(email, password)
    // ✅ Login exitoso
  } catch (error) {
    // ❌ Manejar error específico
    error('Login failed:', error)
  }
}
```

## 🐛 Debug y Troubleshooting

### Función de Debug Global

```javascript
// En la consola del navegador:
window.debugAuth()
```

Esto muestra:
- 🔍 Estado del usuario en Supabase
- 📄 Estado de la sesión
- 🏪 Estado del store Zustand
- 🍪 Cookies de autenticación
- 💾 localStorage
- 🌐 URL y parámetros actuales
- 💡 Recomendaciones de solución

### Utilidades de Debug Programáticas

```tsx
import { checkAuthStatus, refreshAuthState, clearLocalAuthState } from '@/stores/auth'

// Verificar estado
const status = await checkAuthStatus()
log(status) // { isAuthenticated: boolean, user: User | null, error: any }

// Forzar actualización
await refreshAuthState()

// Limpiar estado local (logout manual)
clearLocalAuthState()
```

## 📝 Ejemplos Prácticos

### Login Form Completo

```tsx
'use client'

import { useState } from 'react'
import { useAuth, useAuthStore } from '@/stores/auth'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loading, error } = useAuth()
  const { signInWithEmail, signInWithGoogle } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      error('Login error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      <button type="button" onClick={signInWithGoogle}>
        Continuar con Google
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

### Dashboard con Datos del Usuario

```tsx
'use client'

import { useAuth } from '@/stores/auth'

export const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <div>Cargando dashboard...</div>
  if (!isAuthenticated) return <div>No autorizado</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="user-info">
        <img src={user?.user_metadata?.avatar_url} alt="Avatar" />
        <div>
          <h2>{user?.user_metadata?.full_name || user?.email}</h2>
          <p>{user?.email}</p>
          <span>Rol: {user?.role || 'USER'}</span>
        </div>
      </div>
    </div>
  )
}
```

### Botón de Login/Logout Universal

```tsx
'use client'

import { useAuth, useAuthStore } from '@/stores/auth'

export const AuthButton = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const { signInWithGoogle, signOut } = useAuthStore()

  if (loading) {
    return <button disabled>Cargando...</button>
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span>Hola, {user?.user_metadata?.full_name || user?.email}</span>
        <button onClick={signOut}>Cerrar Sesión</button>
      </div>
    )
  }

  return (
    <button onClick={signInWithGoogle}>
      Iniciar Sesión
    </button>
  )
}
```

## 🚀 Flujo Completo de Autenticación

```
1. Usuario hace click en "Login" 
   ↓
2. signInWithGoogle() → Redirige a Google
   ↓  
3. Google autentica → Redirige a /auth/callback
   ↓
4. Callback intercambia código por sesión
   ↓
5. onAuthStateChange() detecta cambio automáticamente
   ↓
6. Store se actualiza con usuario y sesión
   ↓
7. Componentes se re-renderizan automáticamente
   ↓
8. Usuario redirigido a /dashboard
```

## ⚡ Características Avanzadas

### Actualización Automática

El sistema se sincroniza automáticamente:
- ✅ Entre pestañas del navegador
- ✅ Al expirar tokens
- ✅ Al detectar cambios de sesión
- ✅ Al refresh de página

### Persistencia

- ✅ Sesiones persisten entre recargas
- ✅ Tokens se refrescan automáticamente
- ✅ Estado se mantiene consistente

### Seguridad

- ✅ Tokens seguros en httpOnly cookies
- ✅ Validación en middleware
- ✅ Limpieza automática de sesiones expiradas
- ✅ Protección CSRF integrada

¡El sistema de autenticación está listo para usar en producción! 🎉 