'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from './store'
import { useRouting } from '@/hooks/useRouting'


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
  const { redirectAfterAuth } = useRouting();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Solo redirigir si claramente no hay usuario
    if (!loading && !isAuthenticated) {
      setShouldRedirect(true);
      redirectAfterAuth();
    } else {
      setShouldRedirect(false);
    }
  }, [isAuthenticated, loading, redirectAfterAuth])

  return {
    user,
    session,
    loading,
    isAuthenticated,
    shouldRedirect
  }
}

/**
 * Hook para manejar redirecciones después del login
 */
export const useAuthRedirect = () => {
  const { user, session, loading, isAuthenticated } = useAuthStore()
  const { redirectAfterAuth } = useRouting();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      redirectAfterAuth();
    }
  }, [isAuthenticated, loading, redirectAfterAuth])

  return { user, session, loading, isAuthenticated }
} 