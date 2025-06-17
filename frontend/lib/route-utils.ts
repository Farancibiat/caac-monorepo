import { ROUTES } from '@/config/routes'

/**
 * Lista de rutas privadas que requieren autenticación
 */
export const PRIVATE_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.RESERVATIONS,
  ROUTES.ADMIN,
  ROUTES.PROFILE.COMPLETE,
  ROUTES.PROFILE.EDIT,
] as const

/**
 * Lista de rutas de autenticación
 */
export const AUTH_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.VERIFICATION,
  ROUTES.AUTH.RESEND_CONFIRMATION,
  ROUTES.AUTH.RECOVERY,
  ROUTES.AUTH.RESET_PASSWORD,
] as const

/**
 * Verifica si una ruta es privada (requiere autenticación)
 * Optimizado: todas las rutas que empiezan con /app/ son privadas
 * @param pathname - La ruta a verificar
 * @returns true si la ruta es privada, false en caso contrario
 */
export const isPrivateRoute = (pathname: string): boolean => {
  return pathname.startsWith('/app/')
}

/**
 * Verifica si una ruta es de autenticación
 * @param pathname - La ruta a verificar
 * @returns true si la ruta es de autenticación, false en caso contrario
 */
export const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Verifica si una ruta es pública (no requiere autenticación)
 * @param pathname - La ruta a verificar
 * @returns true si la ruta es pública, false en caso contrario
 */
export const isPublicRoute = (pathname: string): boolean => {
  return !isPrivateRoute(pathname) && !isAuthRoute(pathname)
}

/**
 * Verifica si una ruta es de administración
 * @param pathname - La ruta a verificar
 * @returns true si la ruta es de administración, false en caso contrario
 */
export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/app/admin')
}

/**
 * Verifica si una ruta es de completar perfil
 * @param pathname - La ruta a verificar
 * @returns true si la ruta es de completar perfil, false en caso contrario
 */
export const isCompleteProfileRoute = (pathname: string): boolean => {
  return pathname.startsWith('/app/complete-profile')
}

/**
 * Obtiene el tipo de ruta basado en el pathname
 * @param pathname - La ruta a verificar
 * @returns El tipo de ruta
 */
export const getRouteType = (pathname: string): 'private' | 'auth' | 'public' => {
  if (isPrivateRoute(pathname)) return 'private'
  if (isAuthRoute(pathname)) return 'auth'
  return 'public'
}

/**
 * Verifica si el usuario puede acceder a una ruta específica
 * @param pathname - La ruta a verificar
 * @param isAuthenticated - Si el usuario está autenticado
 * @param userRole - El rol del usuario (opcional)
 * @returns true si el usuario puede acceder, false en caso contrario
 */
export const canAccessRoute = (
  pathname: string, 
  isAuthenticated: boolean, 
  userRole?: 'USER' | 'ADMIN' | 'TREASURER'
): boolean => {
  // Rutas públicas: siempre accesibles
  if (isPublicRoute(pathname)) return true
  
  // Rutas de autenticación: solo si no está autenticado
  if (isAuthRoute(pathname)) return !isAuthenticated
  
  // Rutas privadas: solo si está autenticado
  if (isPrivateRoute(pathname)) {
    if (!isAuthenticated) return false
    
    // Rutas de admin: solo para admin y treasurer
    if (isAdminRoute(pathname)) {
      return userRole === 'ADMIN' || userRole === 'TREASURER'
    }
    
    return true
  }
  
  return false
}