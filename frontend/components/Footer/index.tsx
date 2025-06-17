import Link from 'next/link'
import { ROUTES } from '@/config/routes'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Club de Aguas Abiertas Chiloé
            </h3>
            <p className="text-sm text-neutral-400">
              Promoviendo la natación en aguas abiertas en el archipiélago de Chiloé.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.EVENTOS} className="hover:text-primary-400 transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href={ROUTES.GALERIA} className="hover:text-primary-400 transition-colors">
                  Galería
                </Link>
              </li>
              <li>
                <Link href={ROUTES.NOSOTROS} className="hover:text-primary-400 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CONTACTO} className="hover:text-primary-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Contacto</h4>
            <div className="text-sm text-neutral-400 space-y-1">
              <p>Chiloé, Chile</p>
              <p>Email: contacto@aguasabiertaschiloe.cl</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-neutral-400">
            © {currentYear} Club de Aguas Abiertas Chiloé. Todos los derechos reservados.
          </div>
          
          <div className="text-sm text-neutral-400">
            Desarrollado por{' '}
            <Link 
              href="https://www.farancibiat.cl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Farancibiat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 
export default Footer;