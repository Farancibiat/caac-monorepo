import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROUTES } from '@/constants/routes';

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


const addSecurityHeaders = (response: NextResponse, request: NextRequest) => {

  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  

  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/registro')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  }
  
  return response;
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const protectedRoutes = [ROUTES.DASHBOARD, ROUTES.RESERVATIONS, ROUTES.ADMIN, ROUTES.PROFILE.COMPLETE, ROUTES.PROFILE.EDIT];
  const authRoutes = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isCompleteProfileRoute = pathname.startsWith(ROUTES.PROFILE.COMPLETE)


  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  

  response = addSecurityHeaders(response, request);


  if (!isProtectedRoute && !isAuthRoute) {
    return response;
  }

  try {
    const supabase = createMiddlewareSupabaseClient(request)
  
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      clearSupabaseCookies(request, response)
    }

    if (isProtectedRoute) {
      if (!user) {
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
        loginUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
        loginUrl.searchParams.set(ROUTES.PARAMS.REASON, 'authentication_required');
        return NextResponse.redirect(loginUrl)
      }

      if (!user.email_confirmed_at) {
        const resendConfirmationUrl = new URL(ROUTES.AUTH.RESEND_CONFIRMATION, request.url);
        resendConfirmationUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
        resendConfirmationUrl.searchParams.set(ROUTES.PARAMS.REASON, 'email_not_confirmed');
        return NextResponse.redirect(resendConfirmationUrl);
      }

      if (!isCompleteProfileRoute) {
        const userMetadata = user.user_metadata || {}
        const profileCompleted = userMetadata.profileCompleted === true
        
        if (!profileCompleted) {
          const completeProfileUrl = new URL(ROUTES.PROFILE.COMPLETE, request.url);
          completeProfileUrl.searchParams.set(ROUTES.PARAMS.REDIRECT_TO, pathname);
          completeProfileUrl.searchParams.set(ROUTES.PARAMS.REASON, 'profile_incomplete');
          return NextResponse.redirect(completeProfileUrl);
        }
      }
      
      return response
    }

    if (isAuthRoute) {
      if (user) {
        const redirectTo = request.nextUrl.searchParams.get(ROUTES.PARAMS.REDIRECT_TO) || ROUTES.DASHBOARD
        const redirectResponse = NextResponse.redirect(new URL(redirectTo, request.url));
        return addSecurityHeaders(redirectResponse, request);
      }
      
      return response
    }

  } catch {
    if (isProtectedRoute) {
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