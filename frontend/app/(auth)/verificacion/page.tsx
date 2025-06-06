import React from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Verificación de Correo - Club de Aguas Abiertas Chiloé',
  description: 'Verifica tu correo electrónico'
}

export default function VerificacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-2 bg-club-gradient mx-auto rounded-full"></div>
          <CardTitle className="text-2xl text-primary-800 text-club-shadow">
            Verifica tu Correo Electrónico
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Hemos enviado un correo de verificación a tu dirección de email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Mail className="w-16 h-16 text-primary-600" />
          </div>
          
          <p className="text-neutral-600 text-center">
            Por favor, revisa tu bandeja de entrada (y tu carpeta de spam) y haz clic 
            en el enlace de verificación para activar tu cuenta.
          </p>
          
          <div className="space-y-4">
            <Link href="/login">
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
              >
                Ir a Iniciar Sesión
              </Button>
            </Link>
            
            <div className="text-center">
              <button 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Reenviar correo de verificación
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-neutral-500">
                Si tienes problemas para verificar tu cuenta, por favor contacta con soporte
              </p>
              <Button variant="outline" className="border-accent-300 text-accent-700 hover:bg-accent-50">
                Contactar Soporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 