import { supabaseServer } from '@/stores/auth/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Si "next" está en los parámetros, úsalo como URL de redirección
  const next = searchParams.get('next') ?? searchParams.get('redirectTo') ?? '/dashboard'

  if (code) {
    const supabase = await supabaseServer()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        // Construir URL de redirección
        let redirectUrl: string
        
        if (isLocalEnv) {
          redirectUrl = `${origin}${next}`
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`
        } else {
          redirectUrl = `${origin}${next}`
        }
        
        console.log('✅ Authentication successful, redirecting to:', redirectUrl)
        return NextResponse.redirect(redirectUrl)
      } else {
        console.error('❌ Error exchanging code for session:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error?.message || 'Unknown error')}`)
      }
    } catch (error) {
      console.error('❌ Unexpected error during authentication:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent('Unexpected authentication error')}`)
    }
  }

  // Sin código de autenticación
  console.error('❌ No authentication code provided')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent('No authentication code provided')}`)
} 