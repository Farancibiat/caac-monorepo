'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Camera, Heart, Target, ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/stores/auth/store"
import { ROUTES } from "@/config/routes"
import { CalendarioEventos } from "@/components/home/CalendarioEventos"
import { DesafioCarousel } from "@/components/home/DesafioCarousel"

const VIDEO_HERO_ID = process.env.NEXT_PUBLIC_DRIVE_VIDEO_HERO_ID ?? ''

const Home = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">

      {/* Hero con Video */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center justify-center">
        {VIDEO_HERO_ID ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/hero-poster.jpg"
            src={`/api/drive/video?id=${VIDEO_HERO_ID}`}
          />
        ) : (
          <div className="absolute inset-0 bg-[url('/assets/hero-section.webp')] bg-cover bg-center bg-no-repeat" />
        )}

        {/* Overlay: oscurece para legibilidad sin tapar los tonos carmesí del agua */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/45" />

        {/* Vignette lateral cinematográfico — enfoca al centro sin tapar el agua */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

        {/* Contenido centrado */}
        <div className="animate-fade-in-up relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              {/* Scrim difuso para que el texto 'Chiloé' del logo resalte */}
              <div className="absolute h-32 w-32 rounded-full bg-black/30 blur-xl sm:h-36 sm:w-36" />
              <Image
                src="/assets/logo.png"
                alt="Logo Club de Aguas Abiertas Chiloé"
                width={120}
                height={120}
                priority
                className="relative h-24 w-24 drop-shadow-2xl sm:h-28 sm:w-28"
              />
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-accent-300">
            Bienvenido
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight text-club-shadow sm:text-5xl lg:text-6xl">
            Club de Aguas Abiertas de Chiloé
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 sm:text-xl">
            Una comunidad que nada las aguas abiertas del archipiélago. Entrena, compite
            y vive el mar de Chiloé con nosotros.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={ROUTES.GALERIA}>
              <Button className="h-12 bg-accent-400 px-8 text-lg font-semibold text-accent-900 shadow-lg hover:bg-accent-500">
                <Camera className="mr-2 h-5 w-5" />
                Galería
              </Button>
            </Link>

            <Link href={ROUTES.EVENTOS}>
              <Button
                variant="outline"
                className="h-12 border-2 border-white bg-white/10 px-8 text-lg font-semibold text-white shadow-lg backdrop-blur-sm hover:bg-white hover:text-primary-700"
              >
                Ver Eventos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/80">
          <ChevronDown className="h-7 w-7" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">

        {/* Card Galería */}
        <section>
          <Card className="border-ocean-200 shadow-2xl overflow-hidden bg-gradient-to-br from-ocean-50 to-primary-50">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">

                {/* Carousel de fotos del Desafío 2026 */}
                <DesafioCarousel />

                {/* Contenido */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Camera className="h-8 w-8 text-ocean-600" />
                    <span className="bg-ocean-400 text-ocean-900 px-3 py-1 rounded-full text-sm font-semibold">
                      GALERÍA DEL CLUB
                    </span>
                  </div>

                  <h2 className="text-4xl font-bold text-ocean-800 leading-tight">
                    Revive cada momento
                  </h2>

                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Fotos y videos de nuestras clínicas, desafíos y travesías en las aguas de Chiloé.
                    Cada imagen cuenta una historia de superación, comunidad y pasión por el agua.
                  </p>

                  <div className="pt-4">
                    <Link href={ROUTES.GALERIA}>
                      <Button className="bg-ocean-600 hover:bg-ocean-700 text-white h-12 px-8 text-lg font-semibold">
                        <Camera className="mr-2 h-5 w-5" />
                        Ver Galería de Fotos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sistema de Reservas */}
        <section>
          <Card className="border-primary-200 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">

                {/* Visual */}
                <div className="bg-gradient-to-br from-primary-500 to-ocean-600 flex items-center justify-center p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/assets/piscina.webp')] bg-cover bg-center bg-no-repeat" />
                  <div className="text-center space-y-6 relative z-10" />
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 space-y-6">
                  <h2 className="text-4xl font-bold text-primary-800">
                    Reserva tu Espacio de Entrenamiento
                  </h2>

                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Tenemos 3 horarios disponibles en la piscina de Castro, y contamos con un excelente entrenador
                    para que puedas entrenar a tu ritmo, mejorar tu salud, compartir y mejorar tu rendimiento.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center text-neutral-700">
                      <Target className="h-5 w-5 mr-3 text-primary-600" />
                      <span>Lunes 9PM, Miércoles 8AM y Viernes 7PM</span>
                    </div>
                    <div className="flex items-center text-neutral-700">
                      <Users className="h-5 w-5 mr-3 text-primary-600" />
                      <span>Entrenador: Patricio San Martín</span>
                    </div>
                    <div className="flex items-center text-neutral-700">
                      <Heart className="h-5 w-5 mr-3 text-primary-600" />
                      <span>Ambiente inclusivo y motivador</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    {user ? (
                      <Link href={ROUTES.DASHBOARD}>
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-8 text-lg font-semibold">
                          <Calendar className="mr-2 h-5 w-5" />
                          Reservar Ahora
                        </Button>
                      </Link>
                    ) : (
                      <Link href={ROUTES.AUTH.LOGIN}>
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-8 text-lg font-semibold">
                          <Users className="mr-2 h-5 w-5" />
                          Únete para Reservar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Calendario de Eventos */}
        <section>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-primary-800">
              Calendario de Eventos
            </h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Competencias y actividades de natación para este año y el próximo
            </p>
          </div>
          <CalendarioEventos />
        </section>

      </div>
    </div>
  )
}

export default Home
