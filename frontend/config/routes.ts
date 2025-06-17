export const ROUTES = {
    // Rutas públicas
    HOME: '/',
    EVENTOS: '/eventos',
    GALERIA: '/galeria',
    NOSOTROS: '/nosotros',
    CONTACTO: '/contacto',
    TERMINOS: '/terminos',
    PRIVACIDAD: '/privacidad',
    
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
    
    // Rutas privadas (con prefijo /app/)
    DASHBOARD: '/app/dashboard',
    PROFILE: {
      COMPLETE: '/app/complete-profile',
      EDIT: '/app/settings/profile',
    },
    RESERVATIONS: '/app/reservas',
    ADMIN: '/app/admin',
    
    // Parámetros de URL
    PARAMS: {
      REDIRECT_TO: 'redirectTo',
      REASON: 'reason',
      ERROR: 'error',
      CODE: 'code',
    }
  };