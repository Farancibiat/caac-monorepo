import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES } from '@/constants/routes';

// Función helper para crear cliente Supabase en middleware
// Nota: No podemos usar supabaseServer de stores/auth/clients.ts aquí 
// porque el middleware corre en edge runtime con limitaciones de imports
const createMiddlewareSupabaseClient = (request: NextRequest, response: NextResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )
}

// Función helper para limpiar cookies de Supabase
const clearSupabaseCookies = (request: NextRequest, response: NextResponse) => {
  const supabaseCookies = request.cookies.getAll().filter(cookie => 
    cookie.name.startsWith('sb-') || 
    cookie.name.includes('supabase')
  )
  
  supabaseCookies.forEach(cookie => {
    response.cookies.delete({
      name: cookie.name,
      domain: request.nextUrl.hostname,
      path: '/'
    })
  })
  
  return supabaseCookies.length
}

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // Configuración de rutas
  const protectedRoutes = [ROUTES.DASHBOARD, ROUTES.RESERVATIONS, ROUTES.ADMIN, ROUTES.PROFILE.COMPLETE, ROUTES.PROFILE.EDIT];
  const authRoutes = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Si es una ruta pública, continuar sin validación
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Crear response para manejar cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Crear cliente Supabase
    const supabase = createMiddlewareSupabaseClient(request, response)
    
    // Validar usuario usando getUser() (método recomendado)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Si hay error de autenticación, limpiar cookies
    if (userError) {
      console.log('🔒 Auth error in middleware:', userError.message)
      const clearedCookies = clearSupabaseCookies(request, response)
      console.log(`🧹 Cleared ${clearedCookies} Supabase cookies`)
    }

    // Lógica para rutas protegidas
    if (isProtectedRoute) {
      if (!user) {
        console.log(`🚫 Access denied to ${pathname} - No authenticated user`)
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
        loginUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
        loginUrl.searchParams.set(ROUTES.PARAMS.REASON, 'authentication_required');
        return NextResponse.redirect(loginUrl)
      }

      // Check if email is confirmed
      if (!user.email_confirmed_at) {
        console.log(`🚫 Access denied to ${pathname} for user ${user.email} - Email not confirmed`)
        const resendConfirmationUrl = new URL(ROUTES.AUTH.RESEND_CONFIRMATION, request.url);
        resendConfirmationUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
        resendConfirmationUrl.searchParams.set(ROUTES.PARAMS.REASON, 'email_not_confirmed');
        return NextResponse.redirect(resendConfirmationUrl);
      }
      
      console.log(`✅ Access granted to ${pathname} for user: ${user.email}`)
      return response
    }

    // Lógica para rutas de autenticación
    if (isAuthRoute) {
      if (user) {
        console.log(`🔄 User ${user.email} accessing auth route, redirecting to dashboard`)
        const redirectTo = request.nextUrl.searchParams.get(ROUTES.PARAMS.REDIRECT_TO) || ROUTES.DASHBOARD
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }
      
      console.log(`🔑 Allowing access to auth route: ${pathname}`)
      return response
    }

  } catch (error) {
    console.error('❌ Unexpected error in middleware:', error)
    
    // En caso de error, si es ruta protegida, redirigir a login
    if (isProtectedRoute) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
      loginUrl.searchParams.set(ROUTES.PARAMS.REASON, 'middleware_error');
      return NextResponse.redirect(loginUrl);
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - api routes
     * - static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
} 