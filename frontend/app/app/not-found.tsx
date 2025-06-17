import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/config/routes'

const PrivateNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-6">
      <div className="max-w-3xl w-full">
        {/* Mobile Layout - Logo arriba */}
        <div className="flex flex-col items-center space-y-6 md:hidden">
          <div className="flex justify-center">
            <Image
              src="/assets/logo.png"
              alt="Club de Aguas Abiertas Chiloé"
              width={80}
              height={80}
              className="h-20 w-20"
            />
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-primary-600 text-club-shadow">
              404
            </h1>
            <h2 className="text-xl font-bold text-primary-800">
              Página no encontrada
            </h2>
            <p className="text-neutral-600 text-base">
              La página que buscas no existe en el panel privado.
            </p>
          </div>

          <div className="text-center text-xs text-neutral-500 space-y-1">
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
        <div className="hidden md:flex items-center space-x-8">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Club de Aguas Abiertas Chiloé"
              width={120}
              height={120}
              className="h-32 w-32"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-primary-600 text-club-shadow">
                404
              </h1>
              <h2 className="text-2xl font-bold text-primary-800">
                Página no encontrada
              </h2>
              <p className="text-neutral-600 text-base max-w-md">
                La página que buscas no existe en el panel privado o ha sido movida.
              </p>
            </div>

            <div className="text-neutral-500 space-y-1">
              <p className="text-sm">¿Necesitas ayuda?</p>
              <Link 
                href={ROUTES.CONTACTO} 
                className="text-primary-600 hover:text-primary-700 underline font-medium text-sm"
              >
                Contáctanos aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivateNotFound 