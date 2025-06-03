export const ROUTES = {
    // Rutas públicas
    HOME: '/',
    
    // Rutas de autenticación
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/registro',
      VERIFICATION: '/verificacion',
      RESEND_CONFIRMATION: '/resend-confirmation',
      RECOVERY: '/auth/pass-recovery',
      RESET_PASSWORD: '/auth/reset-password',
      // IMPORTANTE: Estas rutas técnicas deben coincidir con la configuración en Supabase
      // Cambiar estas URLs requiere actualizar la configuración en Supabase Dashboard
      CALLBACK: '/auth/callback',        // ⚠️ Configurable en Supabase Dashboard
      ERROR: '/auth/auth-code-error',    // ⚠️ Referenciado en código de callback
    },
    
    // Rutas privadas
    DASHBOARD: '/dashboard',
    PROFILE: {
      COMPLETE: '/complete-profile',
      EDIT: '/settings/profile',
    },
    RESERVATIONS: '/reservas',
    ADMIN: '/admin',
    
    // Parámetros de URL
    PARAMS: {
      REDIRECT_TO: 'redirectTo',
      REASON: 'reason',
      ERROR: 'error',
      CODE: 'code',
    }
  };