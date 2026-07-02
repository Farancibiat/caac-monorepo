import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/config/routes'
import { CalendarioEventos } from '@/components/home/CalendarioEventos'
import { Calendar, MapPin, Trophy, Users, Waves, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos',
  description:
    'Próximas competencias, clínicas y calendario anual del Club de Aguas Abiertas Chiloé.',
  keywords: ['eventos', 'natación', 'aguas abiertas', 'chiloé', 'competencias', 'calendario'],
}

const EventosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow">
            Eventos y competencias
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-neutral-700">
            Próximos eventos y calendario anual de nuestras competencias y clínicas en aguas abiertas.
            ¿Buscas los tiempos y records del{' '}
            <Link
              href={ROUTES.DESAFIO_QUINCHED}
              className="font-medium text-primary-700 underline underline-offset-2"
            >
              Desafío Quinched
            </Link>
            ? ¿O las fotos en la{' '}
            <Link href={ROUTES.GALERIA} className="font-medium text-primary-700 underline underline-offset-2">
              Galería
            </Link>
            ?
          </p>
          <div className="mx-auto h-2 w-32 rounded-full bg-club-gradient" />
        </div>

        {/* Próximo evento */}
        <section className="mb-20">
          <div className="mb-8 flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-primary-800">Próximos eventos</h2>
          </div>

          <div className="max-w-lg">
            <Card className="flex flex-col border-ocean-200 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-primary-800">
                    4° Desafío Unión de las Islas
                  </CardTitle>
                  <span className="rounded-full bg-ocean-400 px-2 py-1 text-xs font-semibold text-ocean-900 whitespace-nowrap ml-2">
                    PRÓXIMAMENTE
                  </span>
                </div>
                <CardDescription className="text-neutral-600">
                  Cuarta edición del desafío insignia del club en las aguas de Quinched, Chiloé.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col space-y-4">
                <div className="flex-grow space-y-2">
                  <div className="flex items-center text-sm text-neutral-700">
                    <Calendar className="mr-2 h-4 w-4 text-primary-600" />
                    Por definir
                  </div>
                  <div className="flex items-center text-sm text-neutral-700">
                    <MapPin className="mr-2 h-4 w-4 text-primary-600" />
                    Por definir
                  </div>
                  <div className="flex items-center text-sm text-neutral-700">
                    <Users className="mr-2 h-4 w-4 text-primary-600" />
                    Cupos por definir
                  </div>
                  <div className="flex items-center text-sm text-neutral-700">
                    <Waves className="mr-2 h-4 w-4 text-primary-600" />
                    Iniciación | 0,5k | 1k | 3,5k
                  </div>
                </div>

                <Button
                  disabled
                  className="w-full cursor-not-allowed bg-neutral-300 text-neutral-500 hover:bg-neutral-300"
                >
                  Inscripciones — próximamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Calendario de eventos */}
        <section className="mb-20">
          <div className="mb-8 flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-primary-800">Calendario de eventos</h2>
          </div>
          <CalendarioEventos />
        </section>

        {/* Enlace a tiempos y records del Desafío Quinched */}
        <section className="mb-20">
          <Link
            href={ROUTES.DESAFIO_QUINCHED}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-primary-200 bg-white p-6 shadow-sm transition-all hover:border-primary-400 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                <Trophy className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-primary-800">
                  Tiempos y records del Desafío Quinched
                </h2>
                <p className="mt-1 text-neutral-600">
                  Mejores marcas históricas por distancia, categoría y género, y resultados de cada edición.
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 font-semibold text-primary-700 transition-transform group-hover:translate-x-1">
              Ver records
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </section>

        {/* Banner CTA socios */}
        <section className="rounded-xl bg-gradient-to-r from-primary-600 to-ocean-600 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">¿Quieres participar en nuestros eventos?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-primary-100">
            Únete al club para obtener beneficios en eventos, acceso a entrenamientos y formar parte de la
            comunidad.
          </p>
          <Button
            asChild
            className="bg-accent-400 font-semibold text-accent-900 hover:bg-accent-500"
          >
            <Link href={ROUTES.CONTACTO}>Contacto</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

export default EventosPage
