import { forceAuthRefresh } from '@/stores/auth/store'
import { supabaseClient } from '@/stores/auth/clients'
import type { ApiResponse } from '@/types/api'

// Base URL de la API desde variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
  retryAuth?: boolean
}



/**
 * Cliente API genérico para uso en componentes client-side
 * Utiliza el cliente de Supabase directamente para obtener tokens actualizados
 */
export const requestClient = async <T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    requireAuth = true,
    retryAuth = true
  } = options

  // Construir URL completa
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Headers base
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  }

  // Función para obtener el token de autenticación directamente de Supabase
  const getAuthToken = async (attemptRefresh: boolean = false): Promise<string | null> => {
    if (!requireAuth) return null
    
    try {
      // Obtener sesión directamente del cliente de Supabase
      const { data: { session }, error } = await supabaseClient.auth.getSession()
      
      if (error) {
        console.warn('Error obteniendo sesión:', error.message)
        return null
      }
      
      // Si tenemos sesión válida, retornar el token
      if (session?.access_token) {
        return session.access_token
      }
      
      // Si no hay sesión y se permite retry, intentar refrescar
      if (attemptRefresh) {
        try {
          const { data: { session: refreshedSession }, error: refreshError } = await supabaseClient.auth.refreshSession()
          
          if (!refreshError && refreshedSession?.access_token) {
            // Actualizar el store con la nueva sesión
            await forceAuthRefresh()
            return refreshedSession.access_token
          }
        } catch (refreshErr) {
          console.warn('Error refrescando sesión:', refreshErr)
        }
      }
      
      return null
    } catch (err) {
      console.warn('Error en getAuthToken:', err)
      return null
    }
  }

  // Función para realizar la request
  const makeRequest = async (token: string | null): Promise<ApiResponse<T>> => {
    // Agregar token de autorización si está disponible
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // Configurar opciones de fetch
    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(body && method !== 'GET' && { body: JSON.stringify(body) })
    }

    try {
      const response = await fetch(url, fetchOptions)
      
      // Intentar parsear JSON si hay contenido
      let apiResponse: Pick<ApiResponse<T>, 'message' | 'error' | 'data'> | null = null
      if (response.headers.get('content-type')?.includes('application/json')) 
          apiResponse = await response.json()
      return {
        status: response.status,
        ok: response.ok,
        message: apiResponse?.message,
        error: apiResponse?.error || (!response.ok ? `HTTP ${response.status}: ${response.statusText}` : undefined),
        data: apiResponse?.data as T // ← AQUÍ está la clave: extraemos directamente apiResponse.data
      }
    } catch (error) {
      return {
        status: 0,
        ok: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  // Primer intento
  let token = await getAuthToken(false)
  let response = await makeRequest(token)

  // Si la request falló por autenticación y se permite retry
  if (!response.ok && response.status === 401 && retryAuth && requireAuth) {
    // Intentar refrescar el token y hacer la request nuevamente
    token = await getAuthToken(true)
    if (token) {
      response = await makeRequest(token)
    }
  }

  return response
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