'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/store'
import { reqClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loading } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const response = await reqClient.get('/health')
        
        if (!response.ok) {
          toast.error('Tuvimos un problema al iniciar el servidor.', {
            description: 'Acceda nuevamente en 2 minutos.'
          })
        }
      } catch (error) {
        console.error('Ocurrió un error al iniciar el servidor.', error)
        toast.error('Tuvimos un problema al iniciar el servidor.', {
          description: 'Acceda nuevamente en 2 minutos.'
        })
      }
    }

    // Llamada para iniciar el servidor
    wakeUpServer()

    setIsHydrated(true)
  }, [])

  // Mostrar loading solo durante la hidratación inicial o cuando el store está cargando
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 