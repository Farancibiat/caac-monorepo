import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { ROUTES } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Inscripciones - 3° Desafío Unión de las Islas',
  description: 'Inscríbete en el 3° Desafío Unión de las Islas',
  robots: 'noindex, nofollow', // Evita indexación ya que es solo un redirect
}

/**
 * Página de redirect para inscripciones del Desafío 2026
 * Redirige automáticamente al Google Forms de inscripciones
 * 
 * Reemplaza TU_FORM_ID con el ID real de tu Google Forms
 * El ID se encuentra en la URL del formulario entre /d/e/ y /viewform
 * Ejemplo: https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform
 */
export default function InscripcionesPage() {
  // Reemplaza esta URL con la URL completa de tu Google Forms

  
  // Redirect permanente (301) o temporal (302)
  // Usa 302 si quieres poder cambiar la URL más adelante
  redirect(ROUTES.INSCRIPCIONES2026)
}
