import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface RedirectOptions {
  preserveQuery?: boolean;
  reason?: string;
}

export const useRouting = () => {
  const router = useRouter();

  /**
   * Redirige al usuario conservando opcionalmente el contexto
   */
  const redirect = (destination: string, options: RedirectOptions = {}) => {
    // Usar window.location.pathname para el path actual
    const currentPath = window.location.pathname;
    
    // Construir URL con parámetros si es necesario
    let url = destination;
    
    if (options.preserveQuery) {
      url += `?${ROUTES.PARAMS.REDIRECT_TO}=${encodeURIComponent(currentPath)}`;
      
      if (options.reason) {
        url += `&${ROUTES.PARAMS.REASON}=${encodeURIComponent(options.reason)}`;
      }
    }
    
    // Usar router para redirección client-side
    router.push(url);
  };

  /**
   * Redirige después de autenticación, verificando redirectTo en URL
   * Si no hay redirectTo, redirige al dashboard por defecto
   */
  const redirectAfterAuth = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get(ROUTES.PARAMS.REDIRECT_TO);
    
    if (redirectTo && redirectTo !== window.location.pathname) {
      // Limpiar parámetro y redirigir a la URL solicitada
      window.history.replaceState({}, '', window.location.pathname);
      router.push(redirectTo);
      console.log('🔄 Redirecting after auth to:', redirectTo);
      return true;
    } else {
      // Si no hay redirectTo, redirigir al dashboard por defecto
      router.push(ROUTES.DASHBOARD);
      console.log('🔄 Redirecting after auth to dashboard (default)');
      return true;
    }
  };

  /**
   * Obtiene el valor del parámetro redirectTo de la URL actual
   */
  const getRedirectParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(ROUTES.PARAMS.REDIRECT_TO);
  };

  return {
    redirect,
    redirectAfterAuth,
    getRedirectParam,
    // Rutas disponibles para fácil acceso
    routes: ROUTES
  };
};