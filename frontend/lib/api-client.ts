import { useAuthStore } from '@/stores/auth/store'

// Base URL de la API desde variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  status: number
  ok: boolean
}

/**
 * Cliente API genérico para uso en componentes client-side
 * Utiliza el store de auth para obtener automáticamente el token de sesión
 */
export const requestClient = async <T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    requireAuth = true
  } = options

  // Construir URL completa
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Headers base
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  }

  // Obtener token de autenticación si es requerido
  if (requireAuth) {
    const { session } = useAuthStore.getState()
    
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    } else {
      console.warn('API call requires auth but no session token found')
    }
  }

  // Configurar opciones de fetch
  const fetchOptions: RequestInit = {
    method,
    headers,
    ...(body && method !== 'GET' && { body: JSON.stringify(body) })
  }

  try {
    const response = await fetch(url, fetchOptions)
    
    let data: T | undefined
    
    // Intentar parsear JSON si hay contenido
    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        data = await response.json()
      } catch {
        // Si falla el parseo JSON, continuamos sin data
      }
    }

    return {
      data,
      status: response.status,
      ok: response.ok
    }
  } catch (error) {
    console.error('API Client Error:', error)
    
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
      ok: false
    }
  }
}

// Función helper para llamadas más simples
export const reqClient = {
  get: <T = unknown>(endpoint: string, options?: Omit<ApiClientOptions, 'method'>) =>
    requestClient<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    requestClient<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    requestClient<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    requestClient<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T = unknown>(endpoint: string, options?: Omit<ApiClientOptions, 'method'>) =>
    requestClient<T>(endpoint, { ...options, method: 'DELETE' })
} 