'use client'

import { useAuthStore } from './store'

/**
 * Hook para validar si el usuario está autenticado
 */
export const useAuth = () => {
  const { user, session, loading, error, isAuthenticated } = useAuthStore()
  
  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    isLoading: loading
  }
}

/**
 * Hook para verificar si el usuario requiere autenticación
 * Solo expone el estado - no maneja redirects (eso lo hace el middleware/AuthProvider)
 */
export const useRequireAuth = () => {
  const { user, session, loading, isAuthenticated } = useAuthStore()

  return {
    user,
    session,
    loading,
    isAuthenticated,
    isLoading: loading
  }
} 