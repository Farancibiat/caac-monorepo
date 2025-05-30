import { create } from 'zustand'
import { supabaseClient } from './clients'
import { signInWithGoogle as signInWithGoogleAction, signOut as signOutAction } from './actions'
import type { AuthState, AuthUser, AuthSession } from './types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null })
      await signInWithGoogleAction()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al iniciar sesión' })
      console.error('Error signing in with Google:', error)
    } finally {
      set({ loading: false })
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Note: onAuthStateChange will handle the state update
      console.log('Sign in with email successful')
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al iniciar sesión' })
      console.error('Error signing in with email:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email: string, password: string, userData?: Partial<AuthUser>) => {
    try {
      set({ loading: true, error: null })
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      })

      if (error) throw error

      console.log('Sign up successful - check email for verification')
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al registrarse' })
      console.error('Error signing up:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null })
      
      // Limpiar usuario inmediatamente en el store
      set({ user: null, session: null, isAuthenticated: false })
      
      // Ejecutar logout del servidor
      await signOutAction()
      
      console.log('Logout completed successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      set({ error: error instanceof Error ? error.message : 'Error al cerrar sesión' })
      
      // Asegurar que el usuario se limpie incluso si hay error
      set({ user: null, session: null, isAuthenticated: false })
      
      // Forzar redirección manual si el server action falla
      if (typeof window !== 'undefined') {
        try {
          // Limpiar localStorage/sessionStorage relacionado con auth
          localStorage.removeItem('supabase.auth.token')
          sessionStorage.removeItem('supabase.auth.token')
          
          // Redireccionar manualmente
          window.location.href = '/'
        } catch (clientError) {
          console.error('Error in client-side cleanup:', clientError)
        }
      }
    } finally {
      set({ loading: false })
    }
  }
}))

let authInitialized = false

// Función para obtener el estado actual del usuario y sesión
const refreshUserState = async () => {
  try {
    console.log('🔄 Refreshing user state...')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()
    
    if (userError || sessionError) {
      console.log('❌ No valid user session:', userError?.message || sessionError?.message)
      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setSession(null)
      useAuthStore.getState().setError(null)
    } else if (user && session) {
      console.log('✅ User authenticated:', user.email)
      useAuthStore.getState().setUser(user as AuthUser)
      useAuthStore.getState().setSession(session as AuthSession)
      useAuthStore.getState().setError(null)
    } else {
      console.log('ℹ️ No user found')
      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setSession(null)
      useAuthStore.getState().setError(null)
    }
  } catch (error) {
    console.error('❌ Error refreshing user state:', error)
    useAuthStore.getState().setUser(null)
    useAuthStore.getState().setSession(null)
    useAuthStore.getState().setError(null)
  } finally {
    useAuthStore.getState().setLoading(false)
  }
}

// Configurar listener de cambios de estado - SE ACTUALIZA AUTOMÁTICAMENTE
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  console.log('📡 Auth state changed:', event, session?.user?.email || 'no user')
  
  // Marcar como inicializado en el primer evento
  if (!authInitialized) {
    authInitialized = true
    console.log('🚀 Auth system initialized via state change')
  }
  
  const authStore = useAuthStore.getState()
  
  try {
    if (event === 'SIGNED_OUT') {
      console.log('🚪 User signed out')
      authStore.setUser(null)
      authStore.setSession(null)
      authStore.setError(null)
      authStore.setLoading(false)
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
      console.log(`🔐 ${event}: Updating auth state`)
      if (session && session.user) {
        authStore.setUser(session.user as AuthUser)
        authStore.setSession(session as AuthSession)
        authStore.setError(null)
      } else {
        authStore.setUser(null)
        authStore.setSession(null)
      }
      authStore.setLoading(false)
    } else {
      // Para otros eventos, asegurar que loading se establezca correctamente
      authStore.setLoading(false)
    }
  } catch (error) {
    console.error('❌ Error in auth state change:', error)
    authStore.setError(null) // No mostrar errores técnicos al usuario
    authStore.setLoading(false)
  }
})

// Inicialización con timeout para evitar carga infinita
const initializeAuth = async () => {
  // Esperar un poco para dar tiempo a onAuthStateChange
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (!authInitialized) {
    console.log('🚀 Manual auth initialization...')
    await refreshUserState()
    authInitialized = true
  }
}

// Solo inicializar si estamos en el cliente
if (typeof window !== 'undefined') {
  // Pequeño delay para evitar race conditions
  setTimeout(initializeAuth, 50)
}