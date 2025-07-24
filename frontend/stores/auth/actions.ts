'use server'

import { supabaseServer } from './server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ROUTES } from '@/config/routes'

export const signInWithGoogle = async () => {
  const supabase = await supabaseServer()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  if (!origin) {
    throw new Error('Could not determine origin for OAuth redirect')
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}${ROUTES.AUTH.CALLBACK}`,
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
      emailRedirectTo: `${origin}${ROUTES.AUTH.CALLBACK}`,
      data: userData || {}
    }
  })

  if (error) {
    throw error
  }

  return data
}

export const signOut = async () => {
  const cookieStore = await cookies()
  
  try {
    const supabase = await supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        
      }
    }

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
        } catch {
          
        }
      }
    })
    revalidatePath('/', 'layout')
    
  } catch {
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
          } catch {
            
          }
        }
      })
      
      revalidatePath('/', 'layout')
    } catch {
      
    }
  }
} 