import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES } from '@/config/routes'
import { isAuthRoute, isAdminRoute } from '@/lib/route-utils'

const createMiddlewareSupabaseClient = (request: NextRequest) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          const newResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            newResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

const clearSupabaseCookies = (request: NextRequest, response: NextResponse) => {
  const cookiesToClear = request.cookies.getAll().filter(cookie => 
    cookie.name.startsWith('sb-') || 
    cookie.name.includes('supabase') ||
    cookie.name.includes('auth-token')
  )
  
  cookiesToClear.forEach(cookie => {
    response.cookies.delete(cookie.name)
  })
  
  return cookiesToClear.length
}


const isFromOAuthRedirect = (request: NextRequest): boolean => {
  const referer = request.headers.get('referer') || ''
  const isGoogleRedirect = referer.includes('accounts.google.com')

  const hasSupabaseCookies = request.cookies.getAll().some(cookie => 
    cookie.name.startsWith('sb-') && cookie.value.length > 0
  )
  return isGoogleRedirect || hasSupabaseCookies
}


const hasValidAuthCookies = (request: NextRequest): boolean => {
  const cookies = request.cookies.getAll()
  const authCookies = cookies.filter(c => c.name.startsWith('sb-'))
  return authCookies.length > 0 && authCookies.every(c => c.value.length > 10)
}


const getUserWithRetry = async (supabase: ReturnType<typeof createMiddlewareSupabaseClient>, request: NextRequest): Promise<{ user: unknown; error: unknown }> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Si obtenemos un usuario válido, retornamos inmediatamente
    if (user) {
      return { user, error: null }
    }
    
    // Si hay error y no hay cookies válidas, no hacer retry
    if (error && !hasValidAuthCookies(request)) {
      return { user: null, error }
    }
    
    // Solo hacer un retry inmediato si hay cookies válidas pero falla la primera llamada
    if (hasValidAuthCookies(request) && !user) {
      const { data: { user: retryUser }, error: retryError } = await supabase.auth.getUser()
      return { user: retryUser, error: retryError }
    }
    
    return { user, error }
  } catch (err) {
    return { user: null, error: err }
  }
}

const addSecurityHeaders = (response: NextResponse, request: NextRequest) => {

  if (isAdminRoute(request.nextUrl.pathname)) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  

  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/registro')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  }
  
  return response;
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // Verificar si hay código OAuth en la raíz - redirigir al callback apropiado
  if (pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const callbackUrl = new URL(ROUTES.AUTH.CALLBACK, request.url)
    // Preservar todos los parámetros de query
    request.nextUrl.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value)
    })
    return NextResponse.redirect(callbackUrl)
  }

  // Optimización: verificación directa para rutas /app/
  const isProtectedRoute = pathname.startsWith('/app/')
  const isAuthRouteCheck = isAuthRoute(pathname)
  const isCompleteProfileRouteCheck = pathname.startsWith('/app/complete-profile')
  const isOAuthRedirect = isFromOAuthRedirect(request)

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  response = addSecurityHeaders(response, request);

  // Si es una ruta pública (ni protegida ni de auth), permitir acceso directo
  if (!isProtectedRoute && !isAuthRouteCheck) {
    return response;
  }

  // Si es una ruta de autenticación, manejar lógica específica sin validación completa
  if (isAuthRouteCheck) {
    try {
      const supabase = createMiddlewareSupabaseClient(request)
      const { user } = await getUserWithRetry(supabase, request)
      
      // Si ya hay usuario autenticado, redirigir al dashboard
      if (user) {
        const redirectTo = request.nextUrl.searchParams.get(ROUTES.PARAMS.REDIRECT_TO) || ROUTES.DASHBOARD
        const redirectResponse = NextResponse.redirect(new URL(redirectTo, request.url));
        return addSecurityHeaders(redirectResponse, request);
      }
    } catch {
      // En caso de error en rutas de auth, permitir acceso de todos modos
    }
    
    // Permitir acceso a las rutas de autenticación
    return response
  }

  // Para rutas protegidas, hacer validación completa
  if (isProtectedRoute) {
    try {
      const supabase = createMiddlewareSupabaseClient(request)
    
      // Usar retry logic si detectamos OAuth redirect
      const { user, error: userError } = await getUserWithRetry(supabase, request)
      
      if (userError && !isOAuthRedirect) {
        clearSupabaseCookies(request, response)
      }

      if (!user) {
        // Si es un OAuth redirect y no encontramos usuario, ser más tolerante
        if (isOAuthRedirect) {
          response.headers.set('X-Auth-Required', 'oauth-pending')
          return response
        }
        
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
        loginUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
        loginUrl.searchParams.set(ROUTES.PARAMS.REASON, 'authentication_required');
        return NextResponse.redirect(loginUrl)
      }

      const supabaseUser = user as { email_confirmed_at?: string; user_metadata?: Record<string, unknown> }

      if (!supabaseUser.email_confirmed_at) {
        const resendConfirmationUrl = new URL(ROUTES.AUTH.RESEND_CONFIRMATION, request.url);
        resendConfirmationUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
        resendConfirmationUrl.searchParams.set(ROUTES.PARAMS.REASON, 'email_not_confirmed');
        return NextResponse.redirect(resendConfirmationUrl);
      }

      if (!isCompleteProfileRouteCheck) {
        const userMetadata = supabaseUser.user_metadata || {}
        const profileCompleted = userMetadata.profileCompleted === true
        
        if (!profileCompleted) {
          const completeProfileUrl = new URL(ROUTES.PROFILE.COMPLETE, request.url);
          completeProfileUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
          completeProfileUrl.searchParams.set(ROUTES.PARAMS.REASON, 'profile_incomplete');
          return NextResponse.redirect(completeProfileUrl);
        }
      }
      
      return response

    } catch {
      // Si es OAuth redirect y hay error, permitir que pase para manejo client-side
      if (isOAuthRedirect) {
        response.headers.set('X-Auth-Required', 'oauth-error')
        return response
      }
      
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
      loginUrl.searchParams.set(ROUTES.PARAMS.REASON, 'middleware_error');
      const errorResponse = NextResponse.redirect(loginUrl);
      return addSecurityHeaders(errorResponse, request);
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
} 