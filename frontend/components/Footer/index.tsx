import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto text-neutral-300">
      {/* Franja de acento superior */}
      <div className="h-1 w-full bg-club-gradient" />

      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Marca */}
            <div className="space-y-4">
              <div className="inline-block rounded-2xl bg-white/95 p-3 shadow-lg">
                <Image
                  src="/assets/logo.png"
                  alt="Club de Aguas Abiertas Chiloé"
                  width={88}
                  height={88}
                  className="h-20 w-20 object-contain"
                />
              </div>
              <p className="max-w-md text-sm leading-relaxed text-neutral-400">
                Promoviendo la natación en aguas abiertas en el archipiélago de Chiloé.
                Una comunidad que entrena, compite y vive el mar del sur.
              </p>
            </div>

            {/* Contacto */}
            <div className="space-y-4 md:justify-self-end">
              <h4 className="text-base font-semibold text-white">Contacto</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-primary-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="text-neutral-300">Chiloé, Chile</span>
                </div>
                <a
                  href="mailto:contacto@aguasabiertaschiloe.cl"
                  className="group flex items-center gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-primary-400 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="text-neutral-300 transition-colors group-hover:text-primary-400">
                    contacto@aguasabiertaschiloe.cl
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Barra legal + crédito */}
          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link
                href="/politica-privacidad"
                className="text-neutral-400 transition-colors hover:text-primary-400"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terminos-servicio"
                className="text-neutral-400 transition-colors hover:text-primary-400"
              >
                Términos de Servicio
              </Link>
            </div>

            <div className="text-sm text-neutral-500">
              Desarrollado por{' '}
              <Link
                href="https://www.farancibiat.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-400 transition-colors hover:text-primary-300"
              >
                Farancibiat
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-neutral-600 sm:text-left">
            © {currentYear} Club de Aguas Abiertas Chiloé. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
