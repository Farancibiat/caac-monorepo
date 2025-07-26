import { create } from 'zustand'
import { supabaseClient } from './clients'
import type { AuthState, AuthUser, AuthSession } from './types'
import { ROUTES } from '@/config/routes'
import { Session, User } from '@supabase/supabase-js'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  profileCompleted: false,
  shouldCompleteProfile: false,

  signInWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${ROUTES.AUTH.CALLBACK}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'openid email profile phone',
        },
      })

      if (error) {
        throw error
      }

      // No necesitamos hacer nada más aquí - el redirect se maneja automáticamente
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión con Google'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  signUp: async (email: string, password: string, userData?: Partial<AuthUser>) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${ROUTES.AUTH.CALLBACK}`,
          data: userData || {}
        }
      })

      if (error) {
        throw error
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  signOut: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabaseClient.auth.signOut({ scope: 'global' })
      
      if (error) {
        throw error
      }

      // Limpiar estado manualmente
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        profileCompleted: false,
        shouldCompleteProfile: false,
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  // Internal setters
  setUser: (user: AuthUser | null) => {
    const profileCompleted = user?.user_metadata?.profileCompleted === true
    set({ 
      user, 
      isAuthenticated: !!user,
      profileCompleted,
      shouldCompleteProfile: !!user && !profileCompleted
    })
  },

  setSession: (session: AuthSession | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error })
}))

/**
 * Intenta obtener una sesión válida de forma directa
 */
const getValidSession = async (): Promise<{ user: User; session: Session } | null> => {
  try {
    const [userResult, sessionResult] = await Promise.all([
      supabaseClient.auth.getUser(),
      supabaseClient.auth.getSession()
    ])
    
    const { data: { user }, error: userError } = userResult
    const { data: { session }, error: sessionError } = sessionResult
    
    if (!userError && !sessionError && user && session?.access_token) {
      return { user, session }
    }
    
    return null
  } catch {
    return null
  }
}

const refreshUserState = async () => {
  try {
    const result = await getValidSession()
    
    const authStore = useAuthStore.getState()
    
    if (result) {
      const { user, session } = result
      authStore.setUser(user as AuthUser)
      authStore.setSession(session as AuthSession)
      authStore.setError(null)
    } else {
      authStore.setUser(null)
      authStore.setSession(null)
      authStore.setError(null)
    }
  } catch (error) {
    console.warn('Error en refreshUserState:', error)
    const authStore = useAuthStore.getState()
    authStore.setUser(null)
    authStore.setSession(null)
    authStore.setError(null)
  } finally {
    useAuthStore.getState().setLoading(false)
  }
}

// Listener para cambios de estado de autenticación
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  const authStore = useAuthStore.getState()
  
  try {
    if (event === 'SIGNED_OUT') {
      authStore.setUser(null)
      authStore.setSession(null)
      authStore.setError(null)
      authStore.setLoading(false)
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
      if (session && session.user) {
        authStore.setUser(session.user as AuthUser)
        authStore.setSession(session as AuthSession)
        authStore.setError(null)
      } else {
        authStore.setUser(null)
        authStore.setSession(null)
      }
      authStore.setLoading(false)
    }
  } catch (error) {
    console.warn('Error en onAuthStateChange:', error)
    authStore.setError('Error de autenticación')
    authStore.setLoading(false)
  }
})

// Inicializar el estado de autenticación
const initializeAuth = async () => {
  await refreshUserState()
}

// Función para forzar actualización del estado de auth
export const forceAuthRefresh = async () => {
  await refreshUserState()
}

// Inicializar cuando se carga el módulo
if (typeof window !== 'undefined') {
  initializeAuth()
}