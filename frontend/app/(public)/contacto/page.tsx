import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react"
import { Metadata } from "next"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con el Club de Aguas Abiertas Chiloé',
  keywords: ['contacto', 'club', 'natación', 'aguas abiertas', 'chiloé'],
}

const ContactoPage = () => {
  const informacionContacto = [
    {
      icono: <Mail className="h-6 w-6 text-primary-600" />,
      titulo: "Email",
      detalle: "contacto@aguasabiertaschiloe.cl",
      accion: "mailto:contacto@aguasabiertaschiloe.cl"
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
      detalle: "Lun-Vie: 17:00-20:00",
      accion: null
    }
  ]

  const redesSociales = [
    {
      nombre: "Instagram",
      icono: <Instagram className="h-5 w-5" />,
      usuario: "@aguas_abiertas_chiloe_",
      enlace: "https://instagram.com/aguas_abiertas_chiloe_"
    },
    {
      nombre: "Facebook",
      icono: <Facebook className="h-5 w-5" />,
      usuario: "Club Aguas Abiertas Chiloé",
      enlace: "https://facebook.com/Aguas-Abiertas-Chiloe"
    }
  ]

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
            <ContactForm />
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
                  <div className="w-full h-48 rounded-lg overflow-hidden shadow-md border border-primary-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27994.508783948895!2d-73.7968246432309!3d-42.47964034939493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96223cfcf1a3a9c5%3A0xabd8bf191d3a5cff!2sCastro%2C%20Los%20Lagos!5e0!3m2!1ses-419!2scl!4v1750885900359!5m2!1ses-419!2scl"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Ubicación Club de Aguas Abiertas Chiloé - Castro, Chiloé"
                    />
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

export default ContactoPage 