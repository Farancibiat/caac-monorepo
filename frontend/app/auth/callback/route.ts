import { ROUTES } from '@/constants/routes';
import { supabaseServer } from '@/stores/auth/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get(ROUTES.PARAMS.CODE);
  const tokenHash = searchParams.get('token_hash');
  
  // Unificar los parámetros de redirección
  const next = searchParams.get('next') ?? 
               searchParams.get(ROUTES.PARAMS.REDIRECT_TO) ?? 
               ROUTES.DASHBOARD;

  if (code || tokenHash) {
    const supabase = await supabaseServer()
    
    try {
      const { data, error } = tokenHash 
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'signup' })
        : await supabase.auth.exchangeCodeForSession(code!)
      
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
        return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent(error?.message || 'Unknown error')}`)
      }
    } catch (error) {
      console.error('❌ Unexpected error during authentication:', error)
      return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent('Unexpected authentication error')}`)
    }
  }

  // Sin código de autenticación
  console.error('❌ No authentication code provided')
  return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent('No authentication code provided')}`)
} 