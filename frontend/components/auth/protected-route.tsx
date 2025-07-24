'use client'

import { useRequireAuth } from '@/stores/auth'
import RedirectMsj from '@/components/RedirectMsj'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente para proteger rutas que requieren autenticación
 * El middleware maneja los redirects automáticamente
 * 
 * @param children - Contenido a mostrar cuando el usuario está autenticado
 * @param fallback - Componente a mostrar mientras se carga
 */
export const ProtectedRoute = ({ 
  children, 
  fallback
}: ProtectedRouteProps) => {
  const { user, loading } = useRequireAuth()

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

  // Si hay usuario, mostrar contenido protegido
  if (user) {
    return <>{children}</>
  }

  // Si no hay usuario y no está loading, el middleware debería haber redirigido
  // Esto es un fallback por si acaso
  return fallback || (
    <RedirectMsj 
      message="Verificando permisos"
      location="autenticación"
      variant="loading"
    />
  )
} 