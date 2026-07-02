import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail } from 'lucide-react'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

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
                <Image
                  src="/assets/circular-white.svg"
                  alt="Club de Aguas Abiertas Chiloé"
                  width={88}
                  height={88}
                  className="h-20 w-20 object-contain"
                />
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
                  href="https://wa.me/56957831734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-primary-400 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  <span className="text-neutral-300 transition-colors group-hover:text-primary-400">
                    +56 9 5783 1734
                  </span>
                </a>
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
