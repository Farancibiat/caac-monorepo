import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/config/routes'
import { Calendar, MapPin, Users, Clock, ExternalLink, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import imagenDesafioAguas from '@/assets/DSC_0666.JPG';

const eventoDesafio2026 = {
  titulo: '3er Desafío Unión de las Islas de Quinched',
  fecha: '4 y 5 de Abril, 2026',
  /** Ubicación y horario de presentación por día (ambos días presentación 09:00). */
  programacionPorDia: [
    { dia: 'Sábado 4 de Abril', ubicacion: 'Complejo turístico Laguna Millán (clínica y feria). Traslado desde Plaza de Castro.', horarioPresentacion: '09:00' },
    { dia: 'Domingo 5 de Abril', ubicacion: 'Quinchos Quinched, comuna de Chonchi, Chiloé (competencia).', horarioPresentacion: '09:00' },
  ] as const,
  descripcion:
    'Competencia de natación en aguas abiertas del Club de Aguas Abiertas Chiloé. Sábado 4: clínica y feria en Laguna Millán. Domingo 5: competencia en Quinched con circuitos de 100 m (iniciación), 500 m, 1.300 m y 3.500 m. Feria expositores y ambiente familiar.',
  estado: 'Inscripciones Abiertas',
  distancias: [
    { nombre: '100 m', detalle: 'Iniciación. Ida y vuelta a boya 50 m.' },
    { nombre: '500 m', detalle: 'Boya a 250 m.' },
    { nombre: '1.300 m', detalle: 'Ida y regreso a Isla Linlinao.' },
    { nombre: '3.500 m', detalle: 'Vuelta Norte a Sur Isla Linlinao y por Isletilla Quinched.' },
  ],
  contenidoExtra: [
    'Uso obligatorio de boya de seguridad y gafas para todos los nadadores.',
    'Kit de competencia: gorra por categoría, polera y medalla finisher.',
    'Tarifa incluye alimentación, kit y asistencia ambos días.',
    'Feria expositores deportivos sábado en Laguna Millán y domingo en Quinched.',
  ],
  /** Cierre inscripciones y valores según bases. */
  inscripcion: {
    cierre: '24 de Marzo 2026, 23:59 hrs (o hasta agotar cupos).',
    edades: 'Mínimo 12 años (iniciación) y 15 años (500 m, 1.300 m y 3.500 m).',
    valores: [
      'Circuito Iniciación: $0',
      'Pre venta (hasta 10 marzo 2026): $25.500',
      'Inscripción general: $30.000',
    ],
    comprobante: 'Enviar comprobante de depósito a finanzas@aguasabiertaschiloe.cl con nombre y prueba inscrita.',
  },
  /** Resumen según bases oficiales; detalle completo en el PDF. */
  resumenBases: [
    'Programa completo: sábado 4 (clínica y feria en Laguna Millán) y domingo 5 (competencia en Quinched).',
    'Inscripción: completar el formulario y enviar comprobante a finanzas@aguasabiertaschiloe.cl antes del 24 de marzo.',
    'Valores: iniciación gratis; pre venta $25.500 hasta 10 marzo; general $30.000. Incluye alimentación y kit.',
    'Distancias: 100 m (iniciación), 500 m, 1.300 m y 3.500 m. Boya y gafas obligatorias.',
    'Reglamento: tiempos límite por tramo, charla de seguridad obligatoria, embarcaciones de apoyo.',
  ],

  imagenes: [
    { src: imagenDesafioAguas, alt: 'Competencia de aguas abiertas con nadadores, boyas de seguridad y embarcaciones de apoyo' },
    { src: '/assets/partida desafio.webp', alt: 'Partida del Desafío Unión de las Islas en Quinched' },
  ] as const,
}

export const metadata: Metadata = {
  title: '3er Desafío Unión de las Islas de Quinched 2026 | Eventos',
  description:
    'Inscríbete al 3er Desafío Unión de las Islas. Competencia de aguas abiertas 4 y 5 de abril 2026 en Quinched, Chonchi. Circuitos 100 m, 500 m, 1.300 m y 3.500 m.',
  keywords: [
    'desafío unión de las islas',
    'natación aguas abiertas',
    'quinched',
    'chonchi',
    'chiloé',
    'evento 2026',
  ],
}

export default function Desafio2026Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-600">
          <Link
            href={ROUTES.EVENTOS}
            className="hover:text-primary-600 transition-colors"
          >
            Eventos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary-800 font-medium">
            {eventoDesafio2026.titulo}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block bg-accent-400 text-accent-900 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {eventoDesafio2026.estado}
          </span>
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow mb-4">
            {eventoDesafio2026.titulo}
          </h1>
          <p className="text-lg text-neutral-700">{eventoDesafio2026.descripcion}</p>
          <div className="w-24 h-1.5 bg-club-gradient rounded-full mt-4" />
        </div>

        {/* Imagen destacada 1 */}
        <div className="mb-10 -mx-4 sm:mx-0">
          <div className="relative w-full aspect-[21/9] min-h-[200px] rounded-xl overflow-hidden border border-primary-200 shadow-lg">
            <Image
              src={eventoDesafio2026.imagenes[0].src}
              alt={eventoDesafio2026.imagenes[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        {/* Detalle en card */}
        <Card className="border-primary-200 shadow-lg mb-10">
          <CardHeader>
            <CardTitle className="text-primary-800 text-xl">
              Información del evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center text-neutral-700 gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary-600 shrink-0" />
              <span>{eventoDesafio2026.fecha}</span>
            </div>
            <div className="flex items-center text-neutral-700 gap-2 mb-6">
              <Users className="h-5 w-5 text-primary-600 shrink-0" />
              <span>Cupos limitados (inscripción hasta 24 marzo o agotar stock)</span>
            </div>

            <div className="space-y-4 border-t pt-4">
              <p className="text-sm font-medium text-primary-700">Ubicación y horario por día</p>
              {eventoDesafio2026.programacionPorDia.map((item, i) => (
                <div key={i} className="rounded-lg border border-primary-100 bg-primary-50/50 p-4 space-y-2">
                  <p className="font-semibold text-primary-800 text-sm">{item.dia}</p>
                  <div className="flex items-start text-neutral-700 text-sm gap-2">
                    <MapPin className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>{item.ubicacion}</span>
                  </div>
                  <div className="flex items-center text-neutral-700 text-sm gap-2">
                    <Clock className="h-4 w-4 text-primary-600 shrink-0" />
                    <span>Horario de presentación: {item.horarioPresentacion}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-primary-700 mb-2">
                Circuitos y distancias
              </p>
              <ul className="space-y-1.5 text-neutral-700 text-sm">
                {eventoDesafio2026.distancias.map((d, i) => (
                  <li key={i}>
                    <span className="font-medium text-primary-700">{d.nombre}</span>
                    {d.detalle ? ` — ${d.detalle}` : ''}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-primary-700 mb-2">
                Inscripción
              </p>
              <p className="text-neutral-700 text-sm mb-2">{eventoDesafio2026.inscripcion.cierre}</p>
              <p className="text-neutral-700 text-sm mb-2">{eventoDesafio2026.inscripcion.edades}</p>
              <ul className="space-y-1 text-neutral-700 text-sm mb-2">
                {eventoDesafio2026.inscripcion.valores.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
              <p className="text-neutral-600 text-xs">{eventoDesafio2026.inscripcion.comprobante}</p>
            </div>

            <ul className="border-t pt-4 space-y-2">
              {eventoDesafio2026.contenidoExtra.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start text-neutral-700 text-sm"
                >
                  <span className="text-primary-600 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Resumen de lo más importante (detalle completo en PDF) */}
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold text-primary-800 mb-2">
                Lo más importante
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                En las bases oficiales encontrarás, entre otros:
              </p>
              <ul className="space-y-1.5 text-sm text-neutral-700 mb-4">
                {eventoDesafio2026.resumenBases.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary-500 mr-2">·</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary-300 text-primary-700 hover:bg-primary-50"
                >
                  <a
                    href={ROUTES.BASES_DESAFIO_2026}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Descargar bases (PDF)
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary-300 text-primary-700 hover:bg-primary-50"
                >
                  <a
                    href={ROUTES.PLAN_SEGURIDAD_DESAFIO_2026}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Descargar Plan de Seguridad (PDF)
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <Button
                asChild
                className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold shrink-0"
              >
                <a
                  href={ROUTES.INSCRIPCIONES_DESAFIO_2026}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Inscripciones
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild className="border-primary-300">
                <Link href={ROUTES.EVENTOS}>Volver a eventos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Imagen destacada 2 */}
        <div className="mb-10 -mx-4 sm:mx-0">
          <div className="relative w-full aspect-[21/9] min-h-[200px] rounded-xl overflow-hidden border border-primary-200 shadow-lg">
            <Image
              src={eventoDesafio2026.imagenes[1].src}
              alt={eventoDesafio2026.imagenes[1].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-xl p-8 text-white">
          <h2 className="text-xl font-bold mb-2">¿Más preguntas?</h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Escríbenos por contacto o únete al Club para estar al día con todos
            los eventos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
              <Link href={ROUTES.CONTACTO}>Contacto</Link>
            </Button>
            <Button asChild className="bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
              <Link href={ROUTES.AUTH.REGISTER}>Quiero ser Socio</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
