import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { ROUTES } from '@/config/routes'

const AuthCodeErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">
            Error de Autenticación
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Hubo un problema al procesar tu inicio de sesión con Google. 
            Por favor, inténtalo de nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-neutral-500 bg-neutral-50 p-3 rounded-md">
            <p className="font-medium mb-1">Posibles causas:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>El proceso de autenticación fue cancelado</li>
              <li>Configuración incorrecta de OAuth</li>
              <li>Problema temporal del servidor</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.AUTH.LOGIN}>
                Intentar de Nuevo
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={ROUTES.HOME}>
                Volver al Inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCodeErrorPage 