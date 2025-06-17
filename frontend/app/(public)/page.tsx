'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Trophy, Waves, ArrowRight, Star, Heart, Target } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth/store"
import { ROUTES } from "@/config/routes"

const Home = () => {
  const { user } = useAuthStore()

  const proximosEventos = [
    {
      titulo: "3° Desafío Unión de las Islas",
      fecha: "7 de Diciembre, 2025",
      ubicacion: "Quinched, Chiloé",
      participantes: 100,
      tipo: "Competencia",
      distancia: "Iniciación | 0,5k | 1k | 3,5k"
    },
    {
      titulo: "2° Feria de Aguas Abiertas",
      fecha: "7 de Diciembre, 2025",
      ubicacion: "Quinched, Chiloé",
      participantes: 150,
      tipo: "Recreativo",
      distancia: "Expositores Nacionales"
    },
    {
      titulo: "2° Clínica de Aguas Abiertas",
      fecha: "6 de Diciembre, 2025",
      ubicacion: "Laguna Millán, Chiloé",
      participantes: 100,
      tipo: "Formativo",
      distancia: "Iniciación"
    }
  ]

  const estadisticas = [
    { numero: "50+", texto: "Socios Activos", icono: <Users className="h-6 w-6" /> },
    { numero: "40+", texto: "Presencia en eventos ", icono: <Calendar className="h-6 w-6" /> },
    { numero: "4", texto: "Años de Historia", icono: <Trophy className="h-6 w-6" /> },
   
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/hero-section.webp')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/40 to-ocean-600/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 min-h-[80vh] flex items-end">
          <div className="w-full pb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href={ROUTES.DASHBOARD}>
                  <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold h-12 px-8 text-lg shadow-lg">
                    <Users className="mr-2 h-5 w-5" />
                    Ingresa
                  </Button>
                </Link>
              ) : (
                <Link href={ROUTES.AUTH.REGISTER}>
                  <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold h-12 px-8 text-lg shadow-lg">
                    <Users className="mr-2 h-5 w-5" />
                    ¡Regístrate!
                  </Button>
                </Link>
              )}
              
              <Link href={ROUTES.EVENTOS}>
                <Button 
                  variant="outline" 
                  className="border-2 border-white bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary-700 h-12 px-8 text-lg font-semibold shadow-lg"
                >
                  Ver Eventos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-white/80 backdrop-blur-sm border-y border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 lg:grid-cols-3 gap-8">
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
                    las islas de Quinched en una experiencia única de natación en aguas abiertas.
                  </p>
                  
                  <div className="space-y-3 text-neutral-700">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-accent-600" />
                      <span className="font-semibold">7 de Diciembre 2025</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-accent-600" />
                      <span>Quinched, Chiloé</span>
                    </div>
                    <div className="flex items-center">
                      <Waves className="h-5 w-5 mr-3 text-accent-600" />
                      <span> Iniciación | 0,5k | 1k | 3,5k</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link href={ROUTES.EVENTOS}>
                      <Button className="bg-accent-600 hover:bg-accent-700 text-white h-12 px-8 text-lg font-semibold">
                        <Star className="mr-2 h-5 w-5" />
                        Más Información
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Visual */}
                <div className="bg-gradient-to-br from-accent-200 via-yellow-200 to-orange-200 flex items-center justify-center p-8 relative overflow-hidden">
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0 bg-[url('/assets/partida%20desafio.webp')] bg-cover bg-center bg-no-repeat"></div>
                  {/* Overlay para mantener colores */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-accent-200/90 via-yellow-200/10 to-orange-200/40"></div> */}
                  <div className="text-center space-y-4 relative z-10">
                    {/* <div className="w-32 h-32 bg-gradient-to-br from-accent-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto">
                      <Trophy className="h-16 w-16 text-white" />
                    </div> */}
                    {/* <div className="space-y-2">
                      <p className="text-2xl font-bold text-accent-800">¡Pronto!</p>
                      <p className="text-accent-700">Cupos Limitados</p>
                    </div> */}
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
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0 bg-[url('/assets/piscina.webp')] bg-cover bg-center bg-no-repeat"></div>
                  <div className="text-center space-y-6 relative z-10">
                    {/* <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Entrena con Nosotros</h3>
                      <p className="text-primary-100">Reserva tu horario ideal</p>
                    </div> */}
                  </div>
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
                    <Link href={ROUTES.EVENTOS}>
                      <Button 
                        variant="outline" 
                        className="border-primary-300 text-primary-700 hover:bg-primary-50 h-12 px-8 text-lg font-semibold"
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Ver Eventos
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href={ROUTES.EVENTOS}>
              <Button className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-8 text-lg">
                Ver Todos los Eventos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Galería CTA
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
                <Link href={ROUTES.GALERIA}>
                  <Button 
                    variant="outline" 
                    className="border-accent-300 text-accent-700 hover:bg-accent-50 h-12 px-8 text-lg font-semibold"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Ver Galería
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section> */}
      </div>
    </div>
  )
}

export default Home