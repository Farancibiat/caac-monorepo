export const ROUTES = {
    // Rutas públicas
    HOME: '/',
    EVENTOS: '/eventos',
    EVENTO_DESAFIO_2026: '/eventos/desafio-2026',
    GALERIA: '/galeria',
    NOSOTROS: '/nosotros',
    CONTACTO: '/contacto',
    TERMINOS: '/terminos',
    PRIVACIDAD: '/privacidad',
    /** URL externa del formulario; la app usa INSCRIPCIONES_DESAFIO_2026 para pasar por el redirect */
    INSCRIPCIONES2026: 'https://forms.gle/1xFDjzwXk46AKHxu6',
    /** Ruta interna que redirige al formulario de inscripciones (usar en botones en vez del link directo) */
    INSCRIPCIONES_DESAFIO_2026: '/eventos/desafio-2026/inscripciones',
    /** Bases oficiales 3° Desafío Unión de las Islas 2026 (PDF en Google Drive) */
    BASES_DESAFIO_2026: 'https://drive.google.com/file/d/18Rtu6a0AXceQP2adqpxNz2xhUGuJCc0I/view?usp=drive_link',
    /** Plan de Seguridad Club de Natación Aguas Abiertas Chiloé 2026 (PDF en Google Drive) */
    PLAN_SEGURIDAD_DESAFIO_2026: 'https://drive.google.com/file/d/1-XCGtzOwVRRVCd_l9N2IJv2BeEEeLC9h/view?usp=sharing',
    REDIRECTS: {
      GALERIA1: 'https://drive.google.com/drive/folders/1PMImGgKLKwkkjL4t1gYomomgmJ-UnXGR?usp=sharing',
      GALERIA2: 'https://drive.google.com/drive/folders/18Z-KUnE4d_2nSvbcF3T0YJSV7jMxrGKt?usp=sharing',
    },
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