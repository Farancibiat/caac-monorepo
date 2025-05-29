import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Calendar, Users, Image as ImageIcon, Construction, Clock } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Galería de fotos y eventos del Club de Aguas Abiertas Chiloé',
  keywords: ['galería', 'fotos', 'eventos', 'natación', 'aguas abiertas', 'chiloé'],
}

const GaleriaPage = () => {
  // Mock data para preview de categorías futuras
  const categoriasMock = [
    {
      titulo: "Eventos Competitivos",
      descripcion: "Fotos de nuestras competencias y desafíos",
      cantidad: "45+ fotos",
      icono: <Users className="h-8 w-8 text-primary-600" />
    },
    {
      titulo: "Entrenamientos",
      descripcion: "Momentos de nuestras sesiones de entrenamiento",
      cantidad: "120+ fotos",
      icono: <Camera className="h-8 w-8 text-ocean-600" />
    },
    {
      titulo: "Paisajes de Chiloé",
      descripcion: "La belleza natural donde nadamos",
      cantidad: "80+ fotos",
      icono: <ImageIcon className="h-8 w-8 text-accent-600" />
    },
    {
      titulo: "Vida del Club",
      descripcion: "Actividades sociales y momentos especiales",
      cantidad: "60+ fotos",
      icono: <Calendar className="h-8 w-8 text-primary-600" />
    }
  ]

  const eventosDestacados = [
    {
      titulo: "Desafío Unión de las Islas 2024",
      fecha: "Febrero 2024",
      participantes: 38
    },
    {
      titulo: "Copa Chiloé de Aguas Abiertas",
      fecha: "Enero 2024",
      participantes: 65
    },
    {
      titulo: "Travesía Nocturna Castro",
      fecha: "Diciembre 2023",
      participantes: 22
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow">
            Galería
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
            Revive los mejores momentos de nuestros eventos y entrenamientos
          </p>
          <div className="w-32 h-2 bg-club-gradient mx-auto rounded-full"></div>
        </div>

        {/* Mensaje de Desarrollo */}
        <div className="mb-16">
          <Card className="border-amber-200 bg-amber-50 shadow-lg">
            <CardContent className="p-8 text-center">
              <Construction className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                Galería en Desarrollo
              </h2>
              <p className="text-amber-700 text-lg mb-6 max-w-2xl mx-auto">
                Estamos trabajando en una experiencia increíble para compartir las mejores fotos 
                de nuestros eventos y entrenamientos. Pronto podrás ver y descargar todas las 
                imágenes de nuestra comunidad.
              </p>
              <div className="flex items-center justify-center space-x-2 text-amber-600">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Lanzamiento estimado: Abril 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview de Categorías */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-8">
            Próximamente en la Galería
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriasMock.map((categoria, index) => (
              <Card key={index} className="border-neutral-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    {categoria.icono}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800">{categoria.titulo}</h3>
                    <p className="text-sm text-neutral-600 mt-2">{categoria.descripcion}</p>
                  </div>
                  <div className="pt-2 border-t border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {categoria.cantidad}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Eventos Destacados Mock */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-8">
            Eventos Recientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {eventosDestacados.map((evento, index) => (
              <Card key={index} className="border-primary-200 shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-primary-200 via-ocean-200 to-accent-200 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 text-primary-600 mx-auto" />
                    <p className="text-primary-800 font-semibold">Fotos próximamente</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-2">{evento.titulo}</h3>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {evento.fecha}
                    </p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {evento.participantes} participantes
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Funcionalidades Futuras */}
        <section className="mb-16">
          <Card className="border-ocean-200 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-ocean-800 text-center mb-8">
                ¿Qué podrás hacer en nuestra galería?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-ocean-100 rounded-full mx-auto flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-ocean-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-ocean-800">Ver Fotos HD</h3>
                  <p className="text-sm text-neutral-600">
                    Navega por miles de fotos en alta resolución de todos nuestros eventos
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-800">Buscar por Evento</h3>
                  <p className="text-sm text-neutral-600">
                    Encuentra fácilmente las fotos del evento que te interesa
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent-100 rounded-full mx-auto flex items-center justify-center">
                    <Camera className="h-8 w-8 text-accent-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-accent-800">Descargar Gratis</h3>
                  <p className="text-sm text-neutral-600">
                    Descarga tus fotos favoritas sin costo para los socios del club
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">¿Quieres aparecer en nuestra galería?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Únete a nuestros eventos y forma parte de los increíbles momentos que capturamos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
              Ver Próximos Eventos
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-700">
              Saber Más sobre el Club
            </Button>
          </div>
        </section>

        {/* Notificación */}
        <div className="mt-8 text-center">
          <Card className="border-blue-200 bg-blue-50 inline-block">
            <CardContent className="p-4">
              <p className="text-blue-800 text-sm">
                <strong>¿Tienes fotos de nuestros eventos?</strong> Contáctanos para compartirlas con la comunidad
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GaleriaPage 