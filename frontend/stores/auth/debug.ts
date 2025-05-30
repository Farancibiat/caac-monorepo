import { supabaseClient } from './clients'

/**
 * Verifica si hay una sesión activa válida
 */
export const checkAuthStatus = async () => {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser()
    
    if (error) {
      console.error('Error checking auth status:', error)
      return { isAuthenticated: false, user: null, error }
    }

    return { 
      isAuthenticated: !!user, 
      user: user || null,
      error: null
    }
  } catch (error) {
    console.error('Error checking auth status:', error)
    return { isAuthenticated: false, user: null, error }
  }
}

/**
 * Fuerza la actualización del estado de autenticación
 */
export const refreshAuthState = async () => {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser()
    
    if (error) {
      console.error('Error refreshing auth state:', error)
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Error refreshing auth state:', error)
    return { user: null, error }
  }
}

/**
 * Limpia el estado local de autenticación (útil para logout manual)
 */
export const clearLocalAuthState = () => {
  if (typeof window !== 'undefined') {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

/**
 * Función de debug integral para diagnosticar problemas de autenticación
 * Ejecutar desde la consola del navegador: window.debugAuth()
 */
export const debugAuthState = async () => {
  console.group('🔍 Auth Debug State - Comprehensive')
  
  try {
    // 1. Estado del usuario
    console.log('1️⃣ Getting user with getUser()...')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    console.log('👤 User (getUser):', {
      exists: !!user,
      email: user?.email || 'No email',
      id: user?.id || 'No ID',
      metadata: user?.user_metadata || 'No metadata',
      error: userError?.message || 'No error'
    })
    
    // 2. Estado de la sesión
    console.log('2️⃣ Getting session for debug...')
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()
    console.log('📄 Session (debug only):', {
      exists: !!session,
      user: session?.user?.email || 'No user',
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : 'No expiry',
      error: sessionError?.message || 'No error'
    })
    
    // 3. Estado del store
    console.log('3️⃣ Checking store state...')
    const { useAuthStore } = await import('./store')
    const storeState = useAuthStore.getState()
    console.log('🏪 Store State:', {
      hasUser: !!storeState.user,
      userEmail: storeState.user?.email || 'No user',
      loading: storeState.loading,
      error: storeState.error || 'No error'
    })
    
    // 4. Cookies
    if (typeof document !== 'undefined') {
      console.log('4️⃣ Checking cookies...')
      const cookies = document.cookie.split(';').filter(cookie => 
        cookie.includes('sb-') || cookie.includes('supabase')
      )
      console.log('🍪 Supabase Cookies:', cookies.length > 0 ? cookies : 'No cookies found')
    }
    
    // 5. localStorage
    if (typeof localStorage !== 'undefined') {
      console.log('5️⃣ Checking localStorage...')
      const localStorageKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key.includes('supabase')
      )
      console.log('💾 LocalStorage Keys:', localStorageKeys.length > 0 ? localStorageKeys : 'No keys found')
      
      if (localStorageKeys.length > 0) {
        localStorageKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key)
            console.log(`   📝 ${key}:`, value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : 'null')
          } catch (e) {
            console.log(`   ❌ Error reading ${key}:`, e)
          }
        })
      }
    }
    
    // 6. URL actual
    if (typeof window !== 'undefined') {
      console.log('6️⃣ Current location...')
      console.log('🌐 URL:', window.location.href)
      console.log('📍 Pathname:', window.location.pathname)
      console.log('🔗 Search params:', window.location.search)
    }
    
    // 7. Diagnóstico
    console.log('7️⃣ Diagnosis and recommendations...')
    if (userError) {
      console.warn('⚠️ User authentication failed. Possible causes:')
      console.warn('   - Session expired')
      console.warn('   - Invalid credentials')
      console.warn('   - Network issues')
      console.warn('   - Try refreshing the page or logging in again')
    } else if (!user) {
      console.warn('⚠️ No user found. User needs to authenticate.')
    } else if (storeState.loading) {
      console.warn('⚠️ Store is stuck in loading state. This might be a race condition.')
    } else if (!storeState.user) {
      console.warn('⚠️ User exists in Supabase but not in store. Store sync issue.')
    } else {
      console.log('✅ Authentication appears to be working correctly.')
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error)
  }
  
  console.groupEnd()
}

// Hacer disponible globalmente para debug
if (typeof window !== 'undefined') {
  (window as typeof window & { debugAuth: typeof debugAuthState }).debugAuth = debugAuthState
} 