'use server'

import { supabaseServer } from './server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const signInWithGoogle = async () => {
  const supabase = await supabaseServer()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  if (!origin) {
    throw new Error('Origin header is missing')
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
        hd: 'clubaguasabiertaschiloe.com',
      },
      scopes: 'openid email profile',
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }

  if (data.url) {
    redirect(data.url)
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = await supabaseServer()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error signing in with email:', error)
    throw error
  }

  return data
}

export const signUp = async (email: string, password: string, userData?: Record<string, unknown>) => {
  const supabase = await supabaseServer()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: userData || {}
    }
  })

  if (error) {
    console.error('Error signing up:', error)
    throw error
  }

  return data
}

export const signOut = async () => {
  const cookieStore = await cookies()
  
  try {
    // Primero obtener el cliente de Supabase
    const supabase = await supabaseServer()
    
    // Obtener el usuario actual antes de cerrar sesión (método más seguro)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      console.log('Signing out user:', user.email)
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        console.error('Error signing out from Supabase:', error)
        // Continuamos para limpiar cookies locales incluso si Supabase falla
      } else {
        console.log('Successfully signed out from Supabase')
      }
    }

    // Limpiar todas las cookies relacionadas con Supabase
    const allCookies = cookieStore.getAll()
    let cookiesCleared = 0
    
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-') || 
          cookie.name.includes('supabase') ||
          cookie.name.includes('auth-token')) {
        try {
          cookieStore.delete({
            name: cookie.name,
            path: '/',
            domain: undefined // Let the browser determine the domain
          })
          cookiesCleared++
        } catch (error) {
          console.warn(`Failed to delete cookie ${cookie.name}:`, error)
        }
      }
    })
    
    console.log(`Cleared ${cookiesCleared} auth-related cookies`)

    // Revalidar todas las páginas para limpiar cache
    revalidatePath('/', 'layout')
    
  } catch (error) {
    console.error('Error during sign out process:', error)
    
    // Limpiar cookies incluso si hay errores
    try {
      const allCookies = cookieStore.getAll()
      allCookies.forEach(cookie => {
        if (cookie.name.startsWith('sb-') || 
            cookie.name.includes('supabase') ||
            cookie.name.includes('auth-token')) {
          try {
            cookieStore.delete({
              name: cookie.name,
              path: '/',
              domain: undefined
            })
          } catch (deleteError) {
            console.warn(`Failed to delete cookie ${cookie.name} in error handler:`, deleteError)
          }
        }
      })
      
      // Revalidar incluso si hay errores
      revalidatePath('/', 'layout')
    } catch (cleanupError) {
      console.error('Error during cleanup in error handler:', cleanupError)
    }
  }
  
  // Redirigir a la página principal después del logout
  redirect('/')
} 