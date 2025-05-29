'use client'

import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuthStore()

  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-2 bg-club-gradient mx-auto rounded-full"></div>
          <CardTitle className="text-2xl text-primary-800 text-club-shadow">
            Club de Aguas Abiertas Chiloé
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Inicia sesión para acceder a tu cuenta y gestionar tus reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Chrome className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-primary-800">¿Nuevo en el club?</h3>
              <p className="text-sm text-neutral-600">
                Contacta con nosotros para obtener información sobre membresías
              </p>
              <Button variant="outline" className="border-accent-300 text-accent-700 hover:bg-accent-50">
                Información de Contacto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 