import { create } from 'zustand'
import { supabaseClient } from './clients'
import { signInWithGoogle as signInWithGoogleAction, signOut as signOutAction } from './actions'
import type { AuthState, AuthUser, AuthSession } from './types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

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
  profileCompleted: false,
  shouldCompleteProfile: false,

  setUser: (user) => {
    const profileCompleted = user?.user_metadata?.profileCompleted === true
    const shouldCompleteProfile = user ? !profileCompleted : false
    
    set({ 
      user, 
      isAuthenticated: !!user,
      profileCompleted,
      shouldCompleteProfile
    })
    
  },
  
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null })
      await signInWithGoogleAction();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al iniciar sesión' })
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
          data: {
            profileCompleted: false, 
            ...userData
          }
        }
      })

      if (error) throw error

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al registrarse' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
   
    set({ 
      user: null, 
      session: null, 
      isAuthenticated: false, 
      loading: true, 
      error: null,
      profileCompleted: false,
      shouldCompleteProfile: false
    })

    try {
      await signOutAction()
      
      if (appRouter) {
        appRouter.push('/')
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cerrar sesión' })
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        profileCompleted: false,
        shouldCompleteProfile: false
      })
      
      if (typeof window !== 'undefined' && !appRouter) {
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
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()
    
    if (userError || sessionError) {
      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setSession(null)
      useAuthStore.getState().setError(null)
    } else if (user && session) {
      useAuthStore.getState().setUser(user as AuthUser)
      useAuthStore.getState().setSession(session as AuthSession)
      useAuthStore.getState().setError(null)
    } else {
      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setSession(null)
      useAuthStore.getState().setError(null)
    }
  } catch {
    useAuthStore.getState().setUser(null)
    useAuthStore.getState().setSession(null)
    useAuthStore.getState().setError(null)
  } finally {
    useAuthStore.getState().setLoading(false)
  }
}

supabaseClient.auth.onAuthStateChange(async (event, session) => {
  
  if (!authInitialized) {
    authInitialized = true
  }
  
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
    } else {
      authStore.setLoading(false)
    }
  } catch {
    authStore.setError(null)
    authStore.setLoading(false)
  }
})

const initializeAuth = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (!authInitialized) {
    await refreshUserState()
    authInitialized = true
  }
}
if (typeof window !== 'undefined') {
  initializeAuth()
}