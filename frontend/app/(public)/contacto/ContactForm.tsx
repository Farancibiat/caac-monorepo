'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook } from "lucide-react"

const ContactForm = () => {
  const informacionContacto = [
    {
      icono: <Mail className="h-6 w-6 text-primary-600" />,
      titulo: "Email",
      detalle: "info@aguasabiertaschiloe.cl",
      accion: "mailto:info@aguasabiertaschiloe.cl"
    },
    {
      icono: <Phone className="h-6 w-6 text-primary-600" />,
      titulo: "Teléfono",
      detalle: "+56 9 8765 4321",
      accion: "tel:+56987654321"
    },
    {
      icono: <MapPin className="h-6 w-6 text-primary-600" />,
      titulo: "Ubicación",
      detalle: "Castro, Isla de Chiloé",
      accion: null
    },
    {
      icono: <Clock className="h-6 w-6 text-primary-600" />,
      titulo: "Horarios de Atención",
      detalle: "Lun-Vie: 18:00-20:00",
      accion: null
    }
  ]

  const redesSociales = [
    {
      nombre: "Instagram",
      icono: <Instagram className="h-5 w-5" />,
      usuario: "@aguasabiertaschiloe",
      enlace: "https://instagram.com/aguasabiertaschiloe"
    },
    {
      nombre: "Facebook",
      icono: <Facebook className="h-5 w-5" />,
      usuario: "Club Aguas Abiertas Chiloé",
      enlace: "https://facebook.com/aguasabiertaschiloe"
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de envío de formulario
    alert("Funcionalidad en desarrollo. Pronto podrás enviar mensajes.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow">
            Contáctanos
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o quieres unirte a nuestro club? Estamos aquí para ayudarte
          </p>
          <div className="w-32 h-2 bg-club-gradient mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Formulario de Contacto */}
          <div>
            <Card className="border-primary-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-800 flex items-center">
                  <Send className="h-6 w-6 mr-3 text-primary-600" />
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-neutral-700 font-medium">
                        Nombre *
                      </Label>
                      <Input
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre completo"
                        required
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-neutral-700 font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-neutral-700 font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto" className="text-neutral-700 font-medium">
                      Asunto *
                    </Label>
                    <Input
                      id="asunto"
                      type="text"
                      placeholder="¿En qué podemos ayudarte?"
                      required
                      className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje" className="text-neutral-700 font-medium">
                      Mensaje *
                    </Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                      required
                      className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-8">
            
            {/* Datos de Contacto */}
            <Card className="border-ocean-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-ocean-800">
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {informacionContacto.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {item.icono}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-800">{item.titulo}</h4>
                      {item.accion ? (
                        <a
                          href={item.accion}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {item.detalle}
                        </a>
                      ) : (
                        <p className="text-neutral-600">{item.detalle}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card className="border-accent-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-accent-800">
                  Síguenos en Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {redesSociales.map((red, index) => (
                  <a
                    key={index}
                    href={red.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-3 rounded-lg border border-neutral-200 hover:border-accent-300 hover:bg-accent-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-accent-200 rounded-lg flex items-center justify-center group-hover:bg-accent-300 transition-colors">
                      {red.icono}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800">{red.nombre}</p>
                      <p className="text-sm text-neutral-600">{red.usuario}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card className="border-primary-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-800 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-primary-600" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-neutral-700">
                    Nos ubicamos en Castro, corazón de la Isla de Chiloé, con acceso directo 
                    a las mejores aguas para la práctica de natación en aguas abiertas.
                  </p>
                  <div className="w-full h-48 bg-gradient-to-br from-primary-200 to-ocean-200 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 text-primary-600 mx-auto" />
                      <p className="text-primary-800 font-semibold">Mapa Interactivo</p>
                      <p className="text-sm text-primary-600">Próximamente</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-neutral-800 text-center">
                Preguntas Frecuentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      ¿Cómo puedo unirme al club?
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Puedes solicitar tu membresía a través de nuestra página web o contactándonos directamente.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      ¿Necesito experiencia previa?
                    </h4>
                    <p className="text-sm text-neutral-600">
                      No es necesario. Aceptamos nadadores de todos los niveles y ofrecemos entrenamientos adaptados.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      ¿Cuál es el costo de la membresía?
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Contáctanos para conocer las opciones de membresía y valores actualizados.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      ¿Organizan eventos para principiantes?
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Sí, organizamos eventos y entrenamientos especiales para nadadores principiantes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default ContactForm 