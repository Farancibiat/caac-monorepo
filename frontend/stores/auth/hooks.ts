'use client'

import { useEffect, useState } from 'react'
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
 * Hook para proteger rutas que requieren autenticación
 */
export const useRequireAuth = () => {
  const { user, session, loading, isAuthenticated } = useAuthStore()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    // Solo redirigir si claramente no hay usuario
    if (!loading && !isAuthenticated) {
      setShouldRedirect(true)
    } else {
      setShouldRedirect(false)
    }
  }, [isAuthenticated, loading])

  return {
    user,
    session,
    loading,
    shouldRedirect,
    isAuthenticated
  }
}

/**
 * Hook para manejar redirecciones después del login
 */
export const useAuthRedirect = () => {
  const { user, session, loading, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Verificar si hay una URL de redirección guardada
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo')
      
      if (redirectTo && redirectTo !== window.location.pathname) {
        // Limpiar el parámetro de la URL y redirigir
        window.history.replaceState({}, '', window.location.pathname)
        window.location.href = redirectTo
      }
    }
  }, [isAuthenticated, loading])

  return { user, session, loading, isAuthenticated }
} 