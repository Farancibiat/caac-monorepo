'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Trophy, Camera, Waves, ArrowRight, Star, Heart, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/stores/auth/store"

const Home = () => {
  const { user } = useAuthStore()

  const proximosEventos = [
    {
      titulo: "3° Desafío Unión de las Islas",
      fecha: "15 de Marzo, 2024",
      ubicacion: "Quinchao, Chiloé",
      participantes: 45,
      tipo: "Competencia",
      distancia: "2.5 km"
    },
    {
      titulo: "Natación Nocturna Castro",
      fecha: "22 de Marzo, 2024",
      ubicacion: "Castro, Chiloé",
      participantes: 25,
      tipo: "Recreativo",
      distancia: "1 km"
    },
    {
      titulo: "Copa Chiloé de Aguas Abiertas",
      fecha: "5 de Abril, 2024",
      ubicacion: "Ancud, Chiloé",
      participantes: 80,
      tipo: "Competencia",
      distancia: "1.5-5 km"
    }
  ]

  const estadisticas = [
    { numero: "150+", texto: "Nadadores Activos", icono: <Users className="h-6 w-6" /> },
    { numero: "25+", texto: "Eventos Anuales", icono: <Calendar className="h-6 w-6" /> },
    { numero: "6", texto: "Años de Historia", icono: <Trophy className="h-6 w-6" /> },
    { numero: "100%", texto: "Satisfacción", icono: <Heart className="h-6 w-6" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-ocean-600/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Vive la <span className="text-accent-300">Aventura</span> del Agua
                </h1>
                <p className="text-xl text-primary-100 max-w-2xl">
                  Únete al Club de Aguas Abiertas Chiloé y descubre la magia de nadar 
                  en las cristalinas aguas del archipiélago más hermoso de Chile
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold h-12 px-8 text-lg">
                      <Calendar className="mr-2 h-5 w-5" />
                      Reservar Piscina
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold h-12 px-8 text-lg">
                      <Users className="mr-2 h-5 w-5" />
                      Únete al Club
                    </Button>
                  </Link>
                )}
                
                <Link href="/eventos">
                  <Button 
                    variant="outline" 
                    className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-700 h-12 px-8 text-lg font-semibold"
                  >
                    Ver Eventos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Logo/Visual - Mejor ajustado al diseño del logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                  <Image
                    src="/assets/logo.png"
                    alt="Club de Aguas Abiertas Chiloé"
                    width={320}
                    height={320}
                    className="h-72 w-72 lg:h-80 lg:w-80"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-accent-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Waves className="h-8 w-8 text-accent-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-white/80 backdrop-blur-sm border-y border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {estadisticas.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center text-primary-600 mb-2">
                  {stat.icono}
                </div>
                <div className="text-3xl font-bold text-primary-800">{stat.numero}</div>
                <div className="text-sm text-neutral-600 font-medium">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        
        {/* 3° Desafío Unión de las Islas 2026 */}
        <section>
          <Card className="border-accent-200 shadow-2xl overflow-hidden bg-gradient-to-br from-accent-50 to-yellow-50">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                
                {/* Content */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="h-8 w-8 text-accent-600" />
                    <span className="bg-accent-400 text-accent-900 px-3 py-1 rounded-full text-sm font-semibold">
                      EVENTO DESTACADO
                    </span>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-accent-800 leading-tight">
                    3° Desafío Unión de las Islas
                  </h2>
                  
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    El evento más esperado del año está de regreso. Una travesía épica que conecta 
                    las islas de Quinchao en una experiencia única de natación en aguas abiertas.
                  </p>
                  
                  <div className="space-y-3 text-neutral-700">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-accent-600" />
                      <span className="font-semibold">Marzo 2026</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-accent-600" />
                      <span>Quinchao, Chiloé</span>
                    </div>
                    <div className="flex items-center">
                      <Waves className="h-5 w-5 mr-3 text-accent-600" />
                      <span>2.5 km de travesía</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/eventos">
                      <Button className="bg-accent-600 hover:bg-accent-700 text-white h-12 px-8 text-lg font-semibold">
                        <Star className="mr-2 h-5 w-5" />
                        Más Información
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Visual */}
                <div className="bg-gradient-to-br from-accent-200 via-yellow-200 to-orange-200 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-accent-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto">
                      <Trophy className="h-16 w-16 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-accent-800">¡Regístrate Ya!</p>
                      <p className="text-accent-700">Cupos Limitados</p>
                    </div>
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
                <div className="bg-gradient-to-br from-primary-500 to-ocean-600 flex items-center justify-center p-8 text-white">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Entrena con Nosotros</h3>
                      <p className="text-primary-100">Reserva tu horario ideal</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 space-y-6">
                  <h2 className="text-4xl font-bold text-primary-800">
                    Reserva tu Espacio de Entrenamiento
                  </h2>
                  
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Accede a nuestras instalaciones y reserva tu horario de piscina de forma 
                    fácil y segura. Entrena a tu ritmo en el mejor ambiente deportivo de Chiloé.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-neutral-700">
                      <Target className="h-5 w-5 mr-3 text-primary-600" />
                      <span>Horarios flexibles adaptados a tu rutina</span>
                    </div>
                    <div className="flex items-center text-neutral-700">
                      <Users className="h-5 w-5 mr-3 text-primary-600" />
                      <span>Entrenadores certificados disponibles</span>
                    </div>
                    <div className="flex items-center text-neutral-700">
                      <Heart className="h-5 w-5 mr-3 text-primary-600" />
                      <span>Ambiente inclusivo y motivador</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    {user ? (
                      <Link href="/dashboard">
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-8 text-lg font-semibold">
                          <Calendar className="mr-2 h-5 w-5" />
                          Reservar Ahora
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login">
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

        {/* Próximos Eventos Destacados */}
        <section>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-primary-800">
              Próximos Eventos
            </h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              No te pierdas nuestras próximas competencias y entrenamientos especiales
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {proximosEventos.map((evento, index) => (
              <Card key={index} className="border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      evento.tipo === 'Competencia' 
                        ? 'bg-accent-400 text-accent-900' 
                        : 'bg-ocean-400 text-ocean-900'
                    }`}>
                      {evento.tipo}
                    </span>
                  </div>
                  <CardTitle className="text-primary-800 group-hover:text-primary-600 transition-colors">
                    {evento.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-neutral-700">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.fecha}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.ubicacion}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.participantes} inscritos
                    </div>
                    <div className="flex items-center">
                      <Waves className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.distancia}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Link href="/eventos">
                      <Button 
                        variant="outline" 
                        className="w-full border-primary-300 text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all"
                      >
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/eventos">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-8 text-lg">
                Ver Todos los Eventos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Galería CTA */}
        <section>
          <Card className="border-ocean-200 shadow-2xl overflow-hidden bg-gradient-to-br from-ocean-50 to-primary-50">
            <CardContent className="p-8 lg:p-12 text-center space-y-8">
              <div className="space-y-4">
                <Camera className="h-16 w-16 text-ocean-600 mx-auto" />
                <h2 className="text-4xl font-bold text-ocean-800">
                  Galería de Momentos Únicos
                </h2>
                <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                  Revive los mejores momentos de nuestros eventos y entrenamientos. 
                  Cada foto cuenta una historia de superación, amistad y pasión por el agua.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gradient-to-br from-ocean-200 to-primary-200 rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-ocean-600" />
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Link href="/galeria">
                  <Button className="bg-ocean-600 hover:bg-ocean-700 text-white h-12 px-8 text-lg font-semibold">
                    <Camera className="mr-2 h-5 w-5" />
                    Explorar Galería
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default Home