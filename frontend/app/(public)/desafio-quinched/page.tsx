import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
import { RecordsQuinched } from '@/components/eventos/RecordsQuinched'
import { ResultadosPorAnio } from '@/components/eventos/ResultadosPorAnio'
import { BarChart2, CalendarDays, MapPin, Waves } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Desafío Quinched',
  description:
    'Tiempos, records y resultados históricos del Desafío Unión de las Islas de Quinched, la competencia insignia del Club de Aguas Abiertas Chiloé.',
  keywords: [
    'desafío quinched',
    'unión de las islas',
    'records',
    'tiempos',
    'resultados',
    'natación',
    'aguas abiertas',
    'chiloé',
  ],
}

const HIGHLIGHTS = [
  { icon: CalendarDays, label: '3 ediciones', value: '2023 · 2024 · 2026' },
  { icon: Waves, label: '3 distancias', value: '0,5k · 1,3k · 3,5k' },
  { icon: MapPin, label: 'Sede', value: 'Quinched, Chiloé' },
] as const

const DesafioQuinchedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner del desafío */}
        <div className="-mx-4 mb-10 sm:mx-0">
          <div className="overflow-hidden rounded-none border-y border-primary-200 shadow-lg sm:rounded-2xl sm:border">
            <Image
              src="/assets/desafio-quinched-banner.png"
              alt="Desafío Unión de las Islas de Quinched"
              width={2000}
              height={560}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        {/* Encabezado */}
        <div className="mb-10">
          <span className="mb-4 inline-block rounded-full bg-accent-400 px-3 py-1 text-sm font-semibold text-accent-900">
            Competencia insignia del club
          </span>
          <h1 className="mb-4 text-4xl font-bold text-primary-800 text-club-shadow">
            Tiempos y records del Desafío Quinched
          </h1>
          <p className="max-w-3xl text-lg text-neutral-700">
            Revive las mejores marcas del Desafío Unión de las Islas de Quinched: records históricos por
            distancia, categoría y género, junto a los resultados completos de cada edición. ¿Buscas las fotos?
            Visita la{' '}
            <Link
              href={ROUTES.GALERIA}
              className="font-medium text-primary-700 underline underline-offset-2"
            >
              Galería
            </Link>
            .
          </p>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-club-gradient" />
        </div>

        {/* Datos rápidos */}
        <div className="mb-16 grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-primary-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-lg font-bold text-primary-800">{label}</p>
                <p className="text-sm text-neutral-600">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Records del desafío */}
        <section className="mb-20">
          <RecordsQuinched />
        </section>

        {/* Resultados por año */}
        <section className="mb-20">
          <div className="mb-8 flex items-center space-x-3">
            <BarChart2 className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-primary-800">Resultados por edición</h2>
          </div>
          <ResultadosPorAnio />
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-gradient-to-r from-primary-600 to-ocean-600 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">¿Quieres ser parte de la próxima edición?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-primary-100">
            Descubre el calendario de competencias y clínicas del club, y prepárate para el próximo Desafío
            Unión de las Islas.
          </p>
          <Button asChild className="bg-accent-400 font-semibold text-accent-900 hover:bg-accent-500">
            <Link href={ROUTES.EVENTOS}>Ver eventos</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

export default DesafioQuinchedPage
