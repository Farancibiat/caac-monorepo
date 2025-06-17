import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from './RegisterForm'
import { ROUTES } from '@/config/routes'

export const metadata = {
  title: 'Registro - Club de Aguas Abiertas Chiloé',
  description: 'Regístrate en el Club de Aguas Abiertas Chiloé'
}

const RegistroPage=()=> {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-2 bg-club-gradient mx-auto rounded-full"></div>
          <CardTitle className="text-2xl text-primary-800 text-club-shadow">
            Crear una Cuenta
          </CardTitle>
          <CardDescription className="text-neutral-600">
            O{' '}
            <Link 
              href={ROUTES.AUTH.LOGIN} 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              iniciar sesión si ya tienes una cuenta
            </Link>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <RegisterForm />
          
          <div className="border-t border-neutral-200 pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-neutral-500">
                Al registrarte, aceptas nuestros{' '}
                <Link 
                  href={ROUTES.TERMINOS} 
                  className="text-primary-600 hover:text-primary-700 underline"
                  target="_blank"
                >
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link 
                  href={ROUTES.PRIVACIDAD} 
                  className="text-primary-600 hover:text-primary-700 underline"
                  target="_blank"
                >
                  política de privacidad
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default RegistroPage;