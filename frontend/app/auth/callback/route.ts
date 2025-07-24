import { ROUTES } from '@/config/routes';
import { supabaseServer } from '@/stores/auth/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get(ROUTES.PARAMS.CODE);
  const tokenHash = searchParams.get('token_hash');
  
  if (code || tokenHash) {
    const supabase = await supabaseServer()
    
    try {
      const { data, error } = tokenHash 
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'signup' })
        : await supabase.auth.exchangeCodeForSession(code!)
      
      if (!error && data.session) {
        // Asegurar que la sesión esté completamente establecida
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent('Failed to establish session')}`)
        }
        
        let redirectPath: string
        const explicitRedirect = searchParams.get('next') ?? searchParams.get(ROUTES.PARAMS.REDIRECT_TO)
        
        if (explicitRedirect) {
          redirectPath = explicitRedirect
        } else {
          const userMetadata = user.user_metadata || {}
          const profileCompleted = userMetadata.profileCompleted === true
          
          if (profileCompleted) {
            redirectPath = ROUTES.DASHBOARD
          } else {
            redirectPath = ROUTES.PROFILE.COMPLETE
          }
        }
        
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        // Construir URL de redirección completa
        let redirectUrl: string
        
        if (isLocalEnv) {
          redirectUrl = `${origin}${redirectPath}`
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${redirectPath}`
        } else {
          redirectUrl = `${origin}${redirectPath}`
        }
        
        // Crear respuesta con headers apropiados para asegurar que las cookies se establezcan
        const response = NextResponse.redirect(redirectUrl)
        
        // Asegurar que las cookies de autenticación se establezcan correctamente
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        
        return response
      } else {
        return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent(error?.message || 'Unknown error')}`)
      }
    } catch (catchError) {
      const errorMessage = catchError instanceof Error ? catchError.message : 'Unexpected authentication error'
      return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent(errorMessage)}`)
    }
  }
  return NextResponse.redirect(`${origin}${ROUTES.AUTH.ERROR}?${ROUTES.PARAMS.ERROR}=${encodeURIComponent('No authentication code provided')}`)
} 