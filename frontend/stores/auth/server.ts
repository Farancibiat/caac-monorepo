import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { AuthUser } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Función para crear cliente servidor
export const supabaseServer = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // La función set puede ser llamada desde un Server Component
            // ignoramos si falla aquí
          }
        },
      },
    }
  )
}

// Utilidades del servidor
export const getUser = async (): Promise<AuthUser | null> => {
  const supabase = await supabaseServer()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user as AuthUser
  } catch (error) {
    console.error('Error in getUser:', error)
    return null
  }
}

export const requireAuth = async (): Promise<AuthUser> => {
  const user = await getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
} 