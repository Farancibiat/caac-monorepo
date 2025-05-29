import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Waves, Heart, Target, Users, Trophy, Mail } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce la historia, misión y visión del Club de Aguas Abiertas Chiloé',
  keywords: ['club', 'historia', 'natación', 'aguas abiertas', 'chiloé', 'nosotros'],
}

const NosotrosPage = () => {
  const equipoDirectivo = [
    {
      nombre: "María Elena Navarro",
      cargo: "Presidenta",
      experiencia: "15 años en natación competitiva",
      descripcion: "Impulsora del desarrollo de la natación en aguas abiertas en Chiloé"
    },
    {
      nombre: "Carlos Henríquez",
      cargo: "Vicepresidente",
      experiencia: "Entrenador certificado FINA",
      descripcion: "Especialista en técnicas de natación en aguas abiertas"
    },
    {
      nombre: "Ana Sofía Cárdenas",
      cargo: "Tesorera",
      experiencia: "10 años administrando organizaciones deportivas",
      descripcion: "Encargada de la gestión financiera y administrativa del club"
    },
    {
      nombre: "Roberto Mansilla",
      cargo: "Secretario",
      experiencia: "Comunicador y nadador amateur",
      descripcion: "Responsable de comunicaciones y eventos del club"
    }
  ]

  const valores = [
    {
      icono: <Waves className="h-8 w-8 text-primary-600" />,
      titulo: "Conexión con la Naturaleza",
      descripcion: "Promovemos la natación en armonía con el entorno natural único de Chiloé"
    },
    {
      icono: <Heart className="h-8 w-8 text-primary-600" />,
      titulo: "Comunidad",
      descripcion: "Fomentamos un ambiente inclusivo donde todos pueden desarrollar su pasión por la natación"
    },
    {
      icono: <Target className="h-8 w-8 text-primary-600" />,
      titulo: "Excelencia",
      descripcion: "Buscamos la mejora continua en técnica, seguridad y organización de eventos"
    },
    {
      icono: <Trophy className="h-8 w-8 text-primary-600" />,
      titulo: "Superación Personal",
      descripcion: "Apoyamos a cada miembro en el logro de sus metas deportivas y personales"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
            Conoce la historia, misión y valores que nos mueven como club
          </p>
          <div className="w-32 h-2 bg-club-gradient mx-auto rounded-full"></div>
        </div>

        {/* Historia */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary-800">Nuestra Historia</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  El <strong>Club de Aguas Abiertas Chiloé</strong> nació en 2018 del sueño compartido de 
                  un grupo de nadadores apasionados por las aguas cristalinas del archipiélago de Chiloé.
                </p>
                <p>
                  Inspirados por la belleza única de nuestras costas y la rica tradición marítima de la isla, 
                  decidimos crear un espacio donde deportistas de todos los niveles pudieran desarrollar 
                  sus habilidades de natación en el entorno natural más hermoso de Chile.
                </p>
                <p>
                  Desde nuestros inicios con apenas 12 miembros, hemos crecido hasta convertirnos en una 
                  comunidad de más de 150 nadadores activos, organizando eventos que atraen participantes 
                  de todo el país y promoviendo el deporte acuático en la región.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary-200 to-ocean-200 rounded-xl flex items-center justify-center">
                  <Image
                    src="/assets/logo.png"
                    alt="Logo Club de Aguas Abiertas Chiloé"
                    width={200}
                    height={200}
                    className="h-48 w-48"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-800">2018</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="h-8 w-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-primary-800">Nuestra Misión</h3>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  Promover y desarrollar la natación en aguas abiertas en el archipiélago de Chiloé, 
                  brindando un espacio seguro e inclusivo para deportistas de todos los niveles, 
                  fomentando el amor por el deporte acuático y la conservación de nuestros recursos naturales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-ocean-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Waves className="h-8 w-8 text-ocean-600" />
                  <h3 className="text-2xl font-bold text-ocean-800">Nuestra Visión</h3>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  Ser el club de natación en aguas abiertas más reconocido del sur de Chile, 
                  referente en la organización de eventos deportivos sustentables y en la formación 
                  de nadadores comprometidos con la excelencia deportiva y el cuidado del medio ambiente.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Valores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <Card key={index} className="border-neutral-200 shadow-md text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    {valor.icono}
                  </div>
                  <h4 className="text-lg font-semibold text-primary-800">{valor.titulo}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">{valor.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Equipo Directivo */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Equipo Directivo</h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Conoce a las personas que lideran y guían nuestro club hacia nuevos horizontes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipoDirectivo.map((miembro, index) => (
              <Card key={index} className="border-primary-200 shadow-lg text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-ocean-200 rounded-full mx-auto flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary-800">{miembro.nombre}</h4>
                    <p className="text-accent-700 font-semibold">{miembro.cargo}</p>
                  </div>
                  <div className="text-sm text-neutral-600 space-y-2">
                    <p className="font-medium">{miembro.experiencia}</p>
                    <p>{miembro.descripcion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">¿Quieres ser parte de nuestra historia?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Únete a una comunidad que comparte la pasión por la natación y el amor por las aguas de Chiloé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
              <Users className="mr-2 h-5 w-5" />
              Quiero ser Socio
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-700">
              <Mail className="mr-2 h-5 w-5" />
              Contáctanos
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default NosotrosPage 