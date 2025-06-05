/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Headers de seguridad aplicados a todas las rutas
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevenir clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevenir MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Protección XSS básica (legacy, CSP es mejor)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Control de información de referencia
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Prevenir carga de recursos no seguros en HTTPS
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
          // Control de descarga de archivos
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          // Content Security Policy que permite GA4
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: *.supabase.co *.supabase.in",
              "media-src 'self' blob: https:",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://www.google-analytics.com https://analytics.google.com",
              "frame-src 'self' https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      },
      // Headers adicionales para assets estáticos
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}

export default nextConfig
