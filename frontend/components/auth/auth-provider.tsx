'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loading, error } = useAuthStore()

  useEffect(() => {
    // Solo log en desarrollo, no bloquear nunca el renderizado
    if (process.env.NODE_ENV === 'development') {
      if (loading) {
        console.log('🔄 Auth initializing...')
      } else {
        console.log('✅ Auth initialized')
      }
      
      if (error) {
        console.warn('⚠️ Auth error:', error)
      }
    }
  }, [loading, error])

  // NUNCA bloquear el renderizado - siempre mostrar children
  return <>{children}</>
} 