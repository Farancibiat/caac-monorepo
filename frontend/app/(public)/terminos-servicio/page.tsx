import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Términos y condiciones de uso del Club deportivo, social y cultural Aguas abiertas chiloé',
}

export default function TerminosServicioPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Términos de Servicio
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-600 mb-6">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CL')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Aceptación de los Términos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Al acceder y utilizar el sitio web <strong>www.aguasabiertaschiloe.cl</strong> y los servicios del 
                  <strong> Club deportivo, social y cultural Aguas abiertas chiloé</strong> (RUT: 65.219.238-6), 
                  usted acepta estar legalmente obligado por estos términos de servicio y nuestra política de privacidad.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Si no está de acuerdo con algún aspecto de estos términos, no debe utilizar nuestros servicios.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Descripción del Servicio
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Nuestro club ofrece los siguientes servicios:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Sistema de reservas online:</strong> Para horarios de piscina y actividades</li>
                  <li><strong>Organización de eventos:</strong> Competencias de aguas abiertas y actividades recreativas</li>
                  <li><strong>Actividades deportivas:</strong> Entrenamientos de natación en aguas abiertas</li>
                  <li><strong>Información y comunicación:</strong> Sobre eventos, entrenamientos y actividades del club</li>
                  <li><strong>Gestión de membresía:</strong> Registro y administración de socios</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Registro y Cuentas de Usuario
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Requisitos de Registro</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Debe tener al menos 18 años o contar con autorización parental</li>
                      <li>Proporcionar información veraz y actualizada</li>
                      <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                      <li>Ser responsable de todas las actividades realizadas con su cuenta</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Suspensión de Cuentas</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos, 
                      proporcionen información falsa o utilicen los servicios de manera inapropiada.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Sistema de Reservas
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Política de Reservas</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Las reservas están sujetas a disponibilidad</li>
                      <li>Solo los miembros registrados pueden realizar reservas</li>
                      <li>Cada usuario puede tener un máximo de reservas activas simultáneas según las políticas del club</li>
                      <li>Las reservas deben realizarse con anticipación mínima establecida por el club</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Cancelaciones</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Las cancelaciones deben realizarse con al menos 2 horas de anticipación</li>
                      <li>Cancelaciones tardías o no presentarse pueden resultar en restricciones de reserva</li>
                      <li>El club se reserva el derecho de cancelar reservas por motivos operacionales, climáticos o de seguridad</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Normas de Uso y Conducta
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Uso Apropiado</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">Al utilizar nuestros servicios, usted se compromete a:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Cumplir con todas las normas de seguridad en piscina y aguas abiertas</li>
                      <li>Respetar a otros miembros, staff y las instalaciones</li>
                      <li>Seguir las indicaciones del personal del club</li>
                      <li>Utilizar el equipo y las instalaciones de manera responsable</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Conductas Prohibidas</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Comportamiento agresivo, discriminatorio o inapropiado</li>
                      <li>Uso no autorizado de áreas restringidas</li>
                      <li>Ingreso de sustancias prohibidas o peligrosas</li>
                      <li>Uso comercial no autorizado de las instalaciones</li>
                      <li>Interferir con las actividades de otros miembros</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Seguridad y Responsabilidades
                </h2>
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <p className="text-amber-800 font-semibold">
                    ⚠️ IMPORTANTE: Actividades de Riesgo
                  </p>
                  <p className="text-amber-700 mt-2">
                    Las actividades de natación y aguas abiertas conllevan riesgos inherentes. 
                    La participación es bajo su propia responsabilidad.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Responsabilidades del Usuario</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Evaluar su propia capacidad física y técnica antes de participar</li>
                      <li>Informar sobre condiciones médicas relevantes</li>
                      <li>Utilizar equipo de seguridad apropiado cuando sea requerido</li>
                      <li>Seguir todas las instrucciones de seguridad</li>
                      <li>Nadar dentro de sus capacidades y límites</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Limitaciones de Responsabilidad del Club</h3>
                    <p className="text-gray-700 leading-relaxed">
                      El club proporciona instalaciones y servicios con estándares razonables de seguridad, 
                      pero no puede garantizar que las actividades estén libres de riesgo. Los usuarios 
                      participan voluntariamente y asumen los riesgos inherentes a las actividades acuáticas.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  7. Eventos y Competencias
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 Participación en Eventos</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>La inscripción en eventos puede requerir requisitos específicos</li>
                      <li>Los participantes deben cumplir con las reglas y regulaciones del evento</li>
                      <li>El club se reserva el derecho de descalificar participantes por incumplimiento</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 Modificaciones de Eventos</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Los eventos pueden ser modificados, reprogramados o cancelados debido a condiciones 
                      climáticas, razones de seguridad o circunstancias imprevistas.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  8. Propiedad Intelectual
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Todo el contenido del sitio web, incluyendo textos, imágenes, logos, diseños y software, 
                  es propiedad del club o sus licenciantes y está protegido por las leyes de propiedad intelectual. 
                  El uso no autorizado está prohibido.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  9. Limitación de Responsabilidad
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  En la máxima medida permitida por la ley, el club no será responsable por daños indirectos, 
                  incidentales, especiales o consecuenciales que resulten del uso de nuestros servicios. 
                  Nuestra responsabilidad total no excederá el monto pagado por los servicios en los últimos 12 meses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  10. Disponibilidad del Servicio
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos esforzamos por mantener nuestros servicios disponibles, pero no podemos garantizar 
                  un servicio ininterrumpido. Los servicios pueden no estar disponibles debido a mantenimiento, 
                  actualizaciones técnicas o circunstancias fuera de nuestro control.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  11. Terminación del Servicio
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">11.1 Por parte del Usuario</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Puede terminar su cuenta en cualquier momento contactándonos o mediante las 
                      opciones disponibles en su perfil de usuario.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">11.2 Por parte del Club</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Podemos terminar o suspender cuentas que violen estos términos, con o sin previo aviso, 
                      según la gravedad de la infracción.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  12. Modificaciones a los Términos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Los cambios importantes serán notificados a los usuarios registrados por correo electrónico. 
                  El uso continuado de nuestros servicios después de las modificaciones constituye 
                  la aceptación de los nuevos términos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  13. Ley Aplicable y Jurisdicción
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Estos términos se regirán e interpretarán de acuerdo con las leyes de Chile. 
                  Cualquier disputa que surja en relación con estos términos estará sujeta 
                  a la jurisdicción exclusiva de los tribunales de Castro, Región de Los Lagos, Chile.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  14. Información de Contacto
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    Para preguntas sobre estos términos de servicio o para reportar violaciones, contáctenos:
                  </p>
                  <ul className="list-none mt-3 text-gray-700 space-y-1">
                    <li><strong>Email:</strong> contacto@aguasabiertaschiloe.cl</li>
                    <li><strong>Dirección:</strong> Llicaldad sin número, Castro, Región de Los Lagos, Chile</li>
                    <li><strong>Organización:</strong> Club deportivo, social y cultural Aguas abiertas chiloé</li>
                    <li><strong>RUT:</strong> 65.219.238-6</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  15. Disposiciones Generales
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Divisibilidad:</strong> Si alguna disposición de estos términos es inválida, 
                  las demás disposiciones permanecerán en vigor</li>
                  <li><strong>Renuncia:</strong> La falta de ejercicio de cualquier derecho no constituye 
                  una renuncia a dicho derecho</li>
                  <li><strong>Acuerdo completo:</strong> Estos términos, junto con nuestra política de privacidad, 
                  constituyen el acuerdo completo entre las partes</li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <a 
            href="/politica-privacidad"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Ver Política de Privacidad
          </a>
          <a 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
} 