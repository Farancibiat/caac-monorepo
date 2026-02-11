import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/config/routes"
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

const proximosEventos = [
  {
    id: 1,
    titulo: "3° Desafío Unión de las Islas",
    fecha: "5 de Abril, 2026",
    ubicacion: "Quinched, Chiloé",
    participantes: "100 cupos",
    hora: "10:00 AM",
    descripcion: "Travesía de aguas abiertas conectando las islas de Quinched, Chiloé",
    estado: "Inscripciones Abiertas",
    distancia: "Iniciación | 0,5k | 1k | 3,5k",
    detallePath: ROUTES.EVENTO_DESAFIO_2026,
  },
  {
    id: 2,
    // detallePath: null as string | null,
    titulo: "2° Feria de Aguas Abiertas",
    fecha: "5 de Abril, 2026",
    ubicacion: "Quinched, Chiloé",
    participantes: "Abierto a todo público",
    tipo: "Recreativo",
    descripcion: "Feria de aguas abiertas con equipamiento y expositores nacionales",
    estado: "Abierto a público",
  },
  {
    id: 3,
    // detallePath: ROUTES.INSCRIPCIONES2026,
    titulo: "2° Clínica de Aguas Abiertas",
    fecha: "4 de Abril, 2026",
    ubicacion: "Laguna Millán, Chiloé",
    participantes: "100 cupos",
    tipo: "Formativo",
    descripcion: "Clínica de aguas abiertas con especialistas",
    estado: "Inscripciones Abiertas",
  }
]

const eventosAnteriores = [
  {
    id: 4,
    titulo: "1° Desafío Unión de las Islas",
    fecha: "30 de Noviembre, 2023",
    participantes: 70,
    resultado: "Completado exitosamente",
    fotosUrl: ROUTES.REDIRECTS.GALERIA1, 
  },
  {
    id: 5,
    titulo: "2° Desafío Unión de las Islas",
    fecha: "30 de Noviembre, 2024",
    participantes: 22,
    resultado: "Excelentes condiciones",
    fotosUrl: ROUTES.REDIRECTS.GALERIA2,
  }
]

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Calendario de eventos de natación en aguas abiertas del Club de Aguas Abiertas Chiloé',
  keywords: ['eventos', 'natación', 'aguas abiertas', 'chiloé', 'competencias'],
}

const EventosPage = () => {

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
              <Card key={evento.id} className="border-primary-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
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
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center text-sm text-neutral-700">
                      <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.fecha}
                    </div>
                    {evento.hora && (
                      <div className="flex items-center text-sm text-neutral-700">
                        <Clock className="h-4 w-4 mr-2 text-primary-600" />
                        {evento.hora}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-neutral-700">
                      <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.ubicacion}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Users className="h-4 w-4 mr-2 text-primary-600" />
                      {evento.participantes} inscritos
                    </div>
                    {evento.tipo && (
                      <div className="flex items-center text-sm text-neutral-700">
                        <span className="w-4 h-4 mr-2 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        </span>
                        Tipo: {evento.tipo}
                      </div>
                    )}
                  </div>
                  
                  {evento.distancia && (
                    <div className="border-t pt-4">
                      <span className="text-sm font-medium text-primary-700">
                        Distancia: {evento.distancia}
                      </span>
                    </div>
                  )}
                  
                  {'detallePath' in evento && evento.detallePath ? (
                    <Button asChild className="w-full bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
                      <Link href={evento.detallePath}>Inscripciones</Link>
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      className="w-full bg-neutral-300 text-neutral-500 cursor-not-allowed hover:bg-neutral-300"
                    >
                      Inscribiendose en el desafío
                    </Button>
                  )}
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
              <Card
                key={evento.id}
                className="border-primary-200 bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="h-1 w-full bg-club-gradient" />
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800">
                        {evento.titulo}
                      </h3>
                      <p className="text-primary-600 text-sm mt-0.5">{evento.fecha}</p>
                      <p className="text-sm text-neutral-600 mt-1">
                        {evento.participantes} participantes
                      </p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-2.5 py-1 rounded-full text-xs font-medium shrink-0">
                      ✓ {evento.resultado}
                    </span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="w-fit bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold"
                  >
                    <a
                      href={evento.fotosUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver fotos
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">¿Quieres participar en nuestros eventos?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Únete al Club de Aguas Abiertas Chiloé para obtener descuentos en eventos, tener acceso a nuestros entrenamientos y ser parte de la familia del Club.
          </p>
          <div className="flex justify-center">
            <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
              Quiero ser Socio
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default EventosPage 