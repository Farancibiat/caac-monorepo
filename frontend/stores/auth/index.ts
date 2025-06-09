// ===== CLIENT SIDE ONLY =====
// Este archivo es seguro para importar en componentes cliente

// Store
export { useAuthStore } from './store'

// Types
export type { AuthUser, AuthSession, AuthState } from './types'

// Hooks
export { useAuth, useRequireAuth, useAuthRedirect } from './hooks'

// Client (browser only - safe for client components)
export { supabaseClient } from './clients'

// Debug utilities (client safe)
// export { checkAuthStatus, refreshAuthState, clearLocalAuthState, debugAuthState } from './debug'

// ===== SERVER SIDE =====
// Para usar funciones del servidor, importa directamente:
// import { supabaseServer, getUser, requireAuth } from '@/stores/auth/server'
// import { signInWithGoogle, signInWithEmail, signUp, signOut } from '@/stores/auth/actions' 