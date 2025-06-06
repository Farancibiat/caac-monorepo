'use client'

import { useEffect } from 'react'
import { useRequireAuth } from '@/stores/auth'
import { ROUTES } from '@/constants/routes'
import { useRouting } from '@/hooks/useRouting'
import RedirectMsj from '@/components/RedirectMsj'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * @param children - Contenido a mostrar cuando el usuario está autenticado
 * @param fallback - Componente a mostrar mientras se carga o se redirige
 * @param redirectTo - URL a donde redirigir si no está autenticado (default: '/login')
 */
export const ProtectedRoute = ({ 
  children, 
  fallback,
  redirectTo = ROUTES.AUTH.LOGIN 
}: ProtectedRouteProps) => {
  const { user, loading, shouldRedirect } = useRequireAuth()
  const { redirect } = useRouting()

  useEffect(() => {
    if (shouldRedirect) {
      redirect(redirectTo, { 
        preserveQuery: true, 
        reason: 'authentication_required' 
      })
    }
  }, [shouldRedirect, redirectTo, redirect])

  // Mostrar loading mientras se valida la autenticación
  if (loading) {
    return fallback || (
      <RedirectMsj 
        message="Verificando autenticación"
        location="contenido protegido"
        variant="loading"
      />
    )
  }

  // Si no hay usuario y debería redirigir, mostrar loading
  if (shouldRedirect) {
    return fallback || (
      <RedirectMsj 
        message="Redirigiendo al login"
        location="login"
        variant="warning"
      />
    )
  }

  if (user) {
    return <>{children}</>
  }

  // Fallback por defecto
  return fallback || null
} 