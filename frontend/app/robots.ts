import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // Configurar NEXT_PUBLIC_SITE_URL en .env.local para desarrollo o variables de entorno en producción
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aguasabiertaschiloe.cl'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app/*', // Rutas privadas del dashboard
          '/auth/callback', // Callback de autenticación
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 