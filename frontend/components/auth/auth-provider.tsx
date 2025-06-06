'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loading, error } = useAuthStore()

  useEffect(() => {
    
  }, [loading, error])

  return <>{children}</>
} 