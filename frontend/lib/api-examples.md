# API Fetch Client - Ejemplos de Uso

## Configuración

Asegúrate de tener la variable de entorno configurada:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# o para producción
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## API Client (Client-side)

Para usar en componentes `'use client'`:

```typescript
import { reqClient, requestClient } from '@/lib/api-client'

// Usando las funciones helper
const getUserData = async () => {
  const response = await reqClient.get('/users/profile')
  if (response.ok) {
    console.log(response.data)
  }
}

// Creando una reserva
const createReservation = async (reservationData) => {
  const response = await reqClient.post('/reservations', reservationData)
  if (response.ok) {
    console.log('Reserva creada:', response.data)
  }
}

// Usando la función genérica
const updateUser = async (userId, userData) => {
  const response = await requestClient(`/users/${userId}`, {
    method: 'PUT',
    body: userData,
    requireAuth: true
  })
}

// Sin autenticación
const getPublicData = async () => {
  const response = await reqClient.get('/public/events', { requireAuth: false })
}
```

## API Server (Server-side)

Para usar en Server Components, API routes o funciones SSR:

```typescript
import { reqServ, requestServ } from '@/lib/api-server'

// En un Server Component
export default async function UserProfile() {
  const response = await reqServ.get('/users/profile')
  
  if (!response.ok) {
    return <div>Error loading profile</div>
  }
  
  return <div>{response.data.name}</div>
}

// En una API route
export async function POST(request: Request) {
  const body = await request.json()
  
  const response = await requestServ('/reservations', {
    method: 'POST',
    body
  })
  
  return Response.json(response.data)
}

// Sin autenticación en server
const getEvents = async () => {
  const response = await reqServ.get('/public/events', { 
    requireAuth: false 
  })
}
```

## Características

### ✅ Implementado
- **URL base configurable** desde `.env`
- **Métodos HTTP genéricos** (GET, POST, PUT, DELETE, PATCH)
- **Autenticación automática** usando tokens de Supabase
- **Compatibilidad client/server** con APIs separadas
- **Headers personalizables**
- **Tipado TypeScript** genérico
- **Funciones helper** para métodos comunes

### ⚙️ Configuración
- `requireAuth: boolean` - Incluir token de auth (default: true)
- `headers: Record<string, string>` - Headers personalizados
- `body: any` - Cuerpo de la petición (con @ts-ignore para simplicidad)

### 🔧 Error Handling
- No incluye manejo de errores personalizado (como solicitaste)
- Retorna `{ error, status, ok }` para manejo manual
- Console logs para debugging

## Notas Técnicas

1. **Client vs Server**: Se crearon dos APIs porque:
   - Client-side usa `useAuthStore.getState()` para el token
   - Server-side usa `supabaseServer()` para obtener la sesión
   - Evita problemas de hidratación y contexto

2. **Token de Auth**: Se obtiene automáticamente de:
   - Client: `session.access_token` del store de Zustand
   - Server: `session.access_token` de Supabase server

3. **TypeScript**: El `body` usa `any` con eslint-disable para evitar tipos excesivos

## Funciones Disponibles

### Client-side (`@/lib/api-client`)
- **`requestClient`** - Función genérica para todas las peticiones
- **`reqClient`** - Helpers para métodos específicos (get, post, put, patch, delete)

### Server-side (`@/lib/api-server`)
- **`requestServ`** - Función genérica para todas las peticiones  
- **`reqServ`** - Helpers para métodos específicos (get, post, put, patch, delete) 