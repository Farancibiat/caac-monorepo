import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

export type AuthUser = SupabaseUser & {
  role?: 'ADMIN' | 'TREASURER' | 'USER'
  phone?: string
  isActive?: boolean
  profileCompleted?: boolean
}

export type AuthSession = SupabaseSession

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  profileCompleted: boolean
  shouldCompleteProfile: boolean
  
  // Actions
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: Partial<AuthUser>) => Promise<void>
  signOut: () => Promise<void>
  
  // Internal setters
  setUser: (user: AuthUser | null) => void
  setSession: (session: AuthSession | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
} 