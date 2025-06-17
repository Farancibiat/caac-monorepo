'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, User } from 'lucide-react'
import NavBar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/stores/auth/store'
import { ROUTES } from '@/config/routes'

const NotFound = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Mobile Layout - Logo arriba */}
          <div className="flex flex-col items-center space-y-8 md:hidden">
            <div className="flex justify-center">
              <Image
                src="/assets/logo.png"
                alt="Club de Aguas Abiertas Chiloé"
                width={120}
                height={120}
                className="h-24 w-24"
              />
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold text-primary-600 text-club-shadow">
                404
              </h1>
              <h2 className="text-2xl font-bold text-primary-800">
                Página no encontrada
              </h2>
              <p className="text-neutral-600 text-lg">
                Lo sentimos, la página que buscas no existe o ha sido movida.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <Link href={ROUTES.HOME}>
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium">
                  <Home className="mr-2 h-5 w-5" />
                  Volver al Inicio
                </Button>
              </Link>
              
              {user ? (
                <Link href={ROUTES.DASHBOARD}>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary-300 text-primary-700 hover:bg-primary-50 h-12 text-base font-medium"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Ir al Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href={ROUTES.EVENTOS}>
                  <Button 
                    variant="outline" 
                    className="w-full border-accent-300 text-accent-700 hover:bg-accent-50 h-12 text-base font-medium"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Ver Eventos
                  </Button>
                </Link>
              )}
            </div>

            <div className="text-center text-sm text-neutral-500 space-y-2">
              <p>¿Necesitas ayuda?</p>
              <Link 
                href={ROUTES.CONTACTO} 
                className="text-primary-600 hover:text-primary-700 underline font-medium"
              >
                Contáctanos aquí
              </Link>
            </div>
          </div>

          {/* Desktop Layout - Logo al lado */}
          <div className="hidden md:flex items-center space-x-12">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Image
                src="/assets/logo.png"
                alt="Club de Aguas Abiertas Chiloé"
                width={200}
                height={200}
                className="h-48 w-48 lg:h-56 lg:w-56"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h1 className="text-8xl lg:text-9xl font-bold text-primary-600 text-club-shadow">
                  404
                </h1>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-800">
                  Página no encontrada
                </h2>
                <p className="text-neutral-600 text-xl max-w-lg">
                  Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
              </div>

              <div className="text-neutral-500 space-y-2">
                <p>¿Necesitas ayuda?</p>
                <Link 
                  href={ROUTES.CONTACTO} 
                  className="text-primary-600 hover:text-primary-700 underline font-medium text-lg"
                >
                  Contáctanos aquí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default NotFound 