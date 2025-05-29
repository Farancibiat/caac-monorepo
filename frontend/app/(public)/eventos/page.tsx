import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Calendario de eventos de natación en aguas abiertas del Club de Aguas Abiertas Chiloé',
  keywords: ['eventos', 'natación', 'aguas abiertas', 'chiloé', 'competencias'],
}

const EventosPage = () => {
  // Mock data para eventos
  const proximosEventos = [
    {
      id: 1,
      titulo: "3° Desafío Unión de las Islas",
      fecha: "15 de Marzo, 2024",
      hora: "08:00 AM",
      ubicacion: "Quinchao, Chiloé",
      participantes: 45,
      descripcion: "Travesía de aguas abiertas conectando las islas de Quinchao",
      estado: "Próximo",
      distancia: "2.5 km"
    },
    {
      id: 2,
      titulo: "Natación Nocturna Castro",
      fecha: "22 de Marzo, 2024",
      hora: "19:30 PM",
      ubicacion: "Castro, Chiloé",
      participantes: 25,
      descripcion: "Experiencia única de natación nocturna en las aguas de Castro",
      estado: "Inscripciones Abiertas",
      distancia: "1 km"
    },
    {
      id: 3,
      titulo: "Copa Chiloé de Aguas Abiertas",
      fecha: "5 de Abril, 2024",
      hora: "09:00 AM",
      ubicacion: "Ancud, Chiloé",
      participantes: 80,
      descripcion: "Competencia anual oficial del club con múltiples categorías",
      estado: "Próximamente",
      distancia: "1.5 km - 5 km"
    }
  ]

  const eventosAnteriores = [
    {
      id: 4,
      titulo: "2° Desafío Unión de las Islas",
      fecha: "12 de Febrero, 2024",
      participantes: 38,
      resultado: "Completado exitosamente"
    },
    {
      id: 5,
      titulo: "Travesía de Verano",
      fecha: "20 de Enero, 2024",
      participantes: 22,
      resultado: "Excelentes condiciones"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow">
            Eventos y Competencias
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
            Descubre nuestros próximos eventos de natación en aguas abiertas en el hermoso archipiélago de Chiloé
          </p>
          <div className="w-32 h-2 bg-club-gradient mx-auto rounded-full"></div>
        </div>

        {/* Próximos Eventos */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Calendar className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-primary-800">Próximos Eventos</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {proximosEventos.map((evento) => (
              <Card key={evento.id} className="border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-primary-800 text-xl">
                      {evento.titulo}
                    </CardTitle>
                    <span className="bg-accent-400 text-accent-900 px-2 py-1 rounded-full text-xs font-semibold">
                      {evento.estado}
                    </span>
                  </div>
                  <CardDescription className="text-neutral-600">
                    {evento.descripcion}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-neutral-700">
                      <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.fecha}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Clock className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.hora}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.ubicacion}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Users className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.participantes} inscritos
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <span className="text-sm font-medium text-primary-700">
                      Distancia: {evento.distancia}
                    </span>
                  </div>
                  
                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Eventos Anteriores */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-8">Eventos Anteriores</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {eventosAnteriores.map((evento) => (
              <Card key={evento.id} className="border-neutral-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">{evento.titulo}</h3>
                      <p className="text-neutral-600 text-sm">{evento.fecha}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {evento.participantes} participantes
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ {evento.resultado}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">¿Quieres participar en nuestros eventos?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Únete al Club de Aguas Abiertas Chiloé y participa en nuestras increíbles travesías y competencias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
              Quiero ser Socio
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-700">
              Más Información
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default EventosPage 