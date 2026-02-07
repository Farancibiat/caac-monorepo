import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Waves, Heart, Target, Users, Trophy, Mail } from "lucide-react"
import { Waves, Heart, Target, Users, Trophy} from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import perfilFelipe from "@/assets/perfil_felipe.png"
import perfilNadita from "@/assets/perfil_nadita.jpg"
import perfilConni from "@/assets/perfil_conni.jpg"

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce la historia, misión y visión del Club de Aguas Abiertas Chiloé',
  keywords: ['club', 'historia', 'natación', 'aguas abiertas', 'chiloé', 'nosotros'],
}

/** Miembro del equipo: imagen opcional (StaticImageData desde import o path en public) */
type MiembroEquipo = {
  nombre: string
  cargo: string
  experiencia: string
  descripcion: string
  imagen?: typeof perfilFelipe | string
}

const NosotrosPage = () => {
  const equipoDirectivo: MiembroEquipo[] = [
    {
      nombre: "Felipe Arancibia Torres",
      cargo: "Presidente",
      experiencia: "Nadador amateur de aguas abiertas y piscina hace 4 años",
      descripcion: "Fanático de las largas distancias",
      imagen: perfilFelipe,
    },
    {
      nombre: "Nadinne Cárdenas ",
      cargo: "Secretaria",
      experiencia: "Nadadora de aguas abiertas incursionando en triatlón",
      descripcion: "Energía infinita, ¡que alguien la detenga!",
      imagen:perfilNadita
    },
    {
      nombre: "Constanza Zambrano Conejeros",
      cargo: "Tesorera",
      experiencia: "2 años de natación en aguas abiertas y piscina",
      descripcion: "Siempre disponible, ",
      imagen:perfilConni
    },

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
                  El <strong>Club de Aguas Abiertas Chiloé</strong> nació en 2021 del sueño compartido de 
                  un grupo de nadadores apasionados por las aguas cristalinas del archipiélago de Chiloé.
                   El día 11 de Abril de 2022, se constituyó oficialmente el club bajo el registro  N° 328013 en la Municipalidad de Castro.
                </p>
                <p>
                  Inspirados por la belleza única de nuestras costas y la rica tradición marítima de la isla, 
                  decidimos crear un espacio donde deportistas de todos los niveles pudieran desarrollar y compartir
                  sus habilidades de natación en el entorno natural más hermoso de Chile.
                </p>
                <p>
                  Desde nuestros inicios con apenas 12 miembros, hemos crecido hasta convertirnos en una 
                  comunidad de más de 50 socio activos y una red de nadadores amigos a nivel nacional e internacional,
                  organizando eventos que atraen participantes de todo el país y promoviendo el deporte acuático en la región.
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
                  <span className="text-2xl font-bold text-accent-800">2022</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Objetivos del Club */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">Objetivos del Club</h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Los pilares fundamentales que guían nuestro trabajo y compromiso con la comunidad
            </p>
            <div className="w-32 h-2 bg-club-gradient mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
                    <span className="text-primary-800 font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary-800 mb-3">Actividades Integrales</h4>
                    <p className="text-neutral-700 leading-relaxed">
                      Desarrollar entre sus asociadas actividades culturales, recreativas y sociales en general.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-ocean-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-200 to-ocean-300 rounded-full flex items-center justify-center">
                    <span className="text-ocean-800 font-bold text-lg">B</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-800 mb-3">Formación y Superación</h4>
                    <p className="text-neutral-700 leading-relaxed">
                      Interpretar y expresar los intereses y aspiraciones en acciones que tiendan a la formación y superación personal, en el aspecto intelectual, artístico, social, técnico y cultural.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full flex items-center justify-center">
                    <span className="text-accent-800 font-bold text-lg">C</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-accent-800 mb-3">Comunidad y Solidaridad</h4>
                    <p className="text-neutral-700 leading-relaxed">
                      Promover el sentido de comunidad y solidaridad entre sus miembros personas, a través de la convivencia y de la realización de acciones comunes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center">
                    <span className="text-neutral-800 font-bold text-lg">D</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800 mb-3">Desarrollo y Colaboración</h4>
                    <p className="text-neutral-700 leading-relaxed">
                      Propender el desarrollo de sus asociados y, para tal efecto, colaborar con las autoridades del estado, de la I. Municipalidad u otros Organismos Gubernamentales o privados sin fines de lucro.
                    </p>
                  </div>
                </div>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipoDirectivo.map((miembro, index) => (
              <Card key={index} className="border-primary-200 shadow-lg text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-200 to-ocean-200 flex items-center justify-center">
                    {miembro.imagen ? (
                      <Image
                        src={miembro.imagen}
                        alt={miembro.nombre}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="h-10 w-10 text-primary-600" />
                    )}
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
        {/* <section className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-xl p-8 text-white">
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
        </section> */}
      </div>
    </div>
  )
}

export default NosotrosPage 