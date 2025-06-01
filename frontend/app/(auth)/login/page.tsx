import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginForm } from './LoginForm'

const LoginPage = () => {
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
          <LoginForm />

          <div className="text-center">
            <p className="text-sm text-neutral-500">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/registro" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Regístrate aquí
              </Link>
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

export default LoginPage 