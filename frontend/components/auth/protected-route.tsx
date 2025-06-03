'use client'

import { useEffect } from 'react'
import { useRequireAuth } from '@/stores/auth'
import { ROUTES } from '@/constants/routes'
import { useRouting } from '@/hooks/useRouting'

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
      const currentPath = window.location.pathname
      redirect(redirectTo, { 
        preserveQuery: true, 
        reason: 'authentication_required' 
      })
      console.log('🔒 Redirecting to login from protected route:', currentPath)
    }
  }, [shouldRedirect, redirectTo, redirect])

  // Mostrar loading mientras se valida la autenticación
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario y debería redirigir, mostrar loading
  if (shouldRedirect) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-600">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  // Si hay usuario, mostrar el contenido protegido
  if (user) {
    console.log('✅ Access granted to protected route for user:', user.email)
    return <>{children}</>
  }

  // Fallback por defecto
  return fallback || null
} 