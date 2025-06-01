import { create } from 'zustand'
import { supabaseClient } from './clients'
import { signInWithGoogle as signInWithGoogleAction, signOut as signOutAction } from './actions'
import type { AuthState, AuthUser, AuthSession } from './types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

// Helper para obtener el router, ya que no podemos usar el hook directamente en el store
let appRouter: AppRouterInstance | null = null
export const setAppRouter = (router: AppRouterInstance) => {
  appRouter = router
}

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
      await signInWithGoogleAction();
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

      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al iniciar sesión' })
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
   
    set({ user: null, session: null, isAuthenticated: false, loading: true, error: null })

    try {
      // 2. Execute server-side logout logic (cookie clearing, Supabase logout, revalidation)
      await signOutAction()
      console.log('Server action signOutAction completed.')
      
      // 3. Client-side redirect after server action is successful
      if (appRouter) {
        appRouter.push('/') // Redirect to homepage
        console.log('Client-side redirection to / initiated.')
      } else {
        console.warn('App router not available for client-side redirection. Falling back to window.location.href')
        // Fallback if router is not set, though this is less ideal with Next.js App Router
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
    } catch (error) {
      console.error('Error during sign out process:', error)
      set({ error: error instanceof Error ? error.message : 'Error al cerrar sesión' })
      // Ensure user state is cleared even if there was an error
      set({ user: null, session: null, isAuthenticated: false })
      
      // Optional: Fallback redirect on error if not already handled or if appRouter fails
      if (typeof window !== 'undefined' && !appRouter) { // Only if appRouter wasn't available
         window.location.href = '/'; 
      }
    } finally {
      set({ loading: false })
    }
  }
}))

let authInitialized = false

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