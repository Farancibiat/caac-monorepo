'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loading } = useAuthStore()

  
  useEffect(() => {
   
    return () => {}
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return <>{children}</>
} 