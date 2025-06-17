import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

export const metadata = {
  title: '404 - Página no encontrada',
  robots: {
    index: false,
    follow: false,
  },
};

const PublicNotFound=()=> {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Página no encontrada
          </h2>
          <p className="text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          <Link href={ROUTES.HOME}>
            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium">
              Volver al Inicio
            </Button>
          </Link>
          <Link href={ROUTES.CONTACTO}>
            <Button variant="outline" className="w-full border-primary-300 text-primary-700 hover:bg-primary-50 h-12 text-base font-medium">
              Contáctanos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
export default PublicNotFound;