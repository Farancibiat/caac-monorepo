import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad del Club deportivo, social y cultural Aguas abiertas chiloé',
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Política de Privacidad
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-600 mb-6">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-CL')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. Información sobre Nosotros
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  El <strong>Club deportivo, social y cultural Aguas abiertas chiloé</strong> (RUT: 65.219.238-6), 
                  con domicilio en Llicaldad sin número, Castro, Región de Los Lagos, Chile, es el responsable 
                  del tratamiento de sus datos personales a través de nuestro sitio web 
                  <strong> www.aguasabiertaschiloe.cl</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Para cualquier consulta relacionada con esta política de privacidad, puede contactarnos en: 
                  <strong> contacto@aguasabiertaschiloe.cl</strong>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Información que Recopilamos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Recopilamos los siguientes tipos de información personal:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Información de cuenta:</strong> Nombre completo, dirección de correo electrónico, contraseña (encriptada)</li>
                  <li><strong>Información de perfil:</strong> Fecha de nacimiento, número de teléfono, región y comuna de residencia</li>
                  <li><strong>Información de reservas:</strong> Horarios reservados, historial de reservas, preferencias de actividades</li>
                  <li><strong>Información de autenticación:</strong> Datos de perfil público de Google (cuando usa inicio de sesión con Google)</li>
                  <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, páginas visitadas, cookies y datos de análisis</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Cómo Utilizamos su Información
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Utilizamos su información personal para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Proporcionar y mantener nuestros servicios de reserva de piscina</li>
                  <li>Gestionar su cuenta de usuario y perfil</li>
                  <li>Procesar sus reservas y comunicarle cambios importantes</li>
                  <li>Enviar notificaciones sobre eventos y actividades del club</li>
                  <li>Mejorar nuestros servicios mediante análisis de uso</li>
                  <li>Cumplir con obligaciones legales y reglamentarias</li>
                  <li>Proteger la seguridad de nuestros usuarios y servicios</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Compartir Información con Terceros
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Compartimos información limitada con los siguientes terceros:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Google:</strong> Cuando utiliza el inicio de sesión con Google, compartimos información básica de autenticación</li>
                  <li><strong>Google Analytics:</strong> Datos anónimos de uso del sitio web para análisis estadístico</li>
                  <li><strong>Supabase (Brasil):</strong> Nuestro proveedor de base de datos almacena de forma segura su información en servidores ubicados en São Paulo, Brasil</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>No vendemos, alquilamos ni compartimos</strong> su información personal con terceros para fines comerciales.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Cookies y Tecnologías de Seguimiento
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Utilizamos las siguientes tecnologías:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio web y gestión de sesiones</li>
                  <li><strong>Google Analytics:</strong> Para analizar el tráfico y mejorar la experiencia del usuario</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Puede desactivar las cookies en su navegador, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  6. Seguridad de los Datos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
                  su información personal contra acceso no autorizado, alteración, divulgación o destrucción. 
                  Esto incluye encriptación de contraseñas, conexiones HTTPS y acceso restringido a los datos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  7. Sus Derechos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Conforme a la legislación chilena sobre protección de datos personales, usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre usted</li>
                  <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                  <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos personales</li>
                  <li><strong>Portabilidad:</strong> Obtener una copia de sus datos en formato estructurado</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Para ejercer estos derechos, contáctenos en: <strong>contacto@aguasabiertaschiloe.cl</strong>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  8. Retención de Datos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Conservamos su información personal durante el tiempo necesario para cumplir con los 
                  propósitos descritos en esta política, salvo que la ley requiera o permita un período 
                  de retención más largo. Los datos de reservas se conservan por razones de auditoría 
                  y cumplimiento legal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  9. Transferencias Internacionales
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Sus datos pueden ser transferidos y almacenados en servidores ubicados en Brasil 
                  (Supabase) y Estados Unidos (Google). Estos proveedores implementan medidas de 
                  seguridad adecuadas para proteger su información conforme a estándares internacionales.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  10. Menores de Edad
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nuestros servicios están dirigidos a personas mayores de 18 años. Los menores de edad 
                  deben contar con autorización de sus padres o tutores legales para utilizar nuestros servicios 
                  y proporcionar información personal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  11. Cambios a esta Política
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
                  Los cambios serán publicados en esta página con una nueva fecha de &quot;última actualización&quot;. 
                  Le recomendamos revisar periódicamente esta política para mantenerse informado sobre 
                  cómo protegemos su información.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  12. Contacto
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    Si tiene preguntas sobre esta política de privacidad o sobre el tratamiento de sus datos personales, 
                    puede contactarnos:
                  </p>
                  <ul className="list-none mt-3 text-gray-700 space-y-1">
                    <li><strong>Email:</strong> contacto@aguasabiertaschiloe.cl</li>
                    <li><strong>Dirección:</strong> Llicaldad sin número, Castro, Región de Los Lagos, Chile</li>
                    <li><strong>Organización:</strong> Club deportivo, social y cultural Aguas abiertas chiloé</li>
                    <li><strong>RUT:</strong> 65.219.238-6</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
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