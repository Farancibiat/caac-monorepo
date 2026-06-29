/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Turbopack (Next.js 16 default). Empty config silences the webpack/turbopack mismatch warning.
  turbopack: {},

  // Asegura que el logo (leído por la ruta de descarga con watermark) se incluya en el bundle serverless.
  outputFileTracingIncludes: {
    '/api/drive/download': ['./public/assets/circular-transparent.svg'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },

  // Headers de seguridad habilitados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.googletagmanager.com https://*.googleapis.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://*.googleapis.com",
              "font-src 'self' https://*.gstatic.com",
              "img-src 'self' data: https: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.googleusercontent.com https://lh3.googleusercontent.com https://drive.google.com",
              "connect-src 'self' https://api.aguasabiertaschiloe.cl https://*.supabase.co wss://*.supabase.co http://localhost:3001 https://*.google-analytics.com https://*.googleapis.com",
              "frame-src 'self' https://*.google.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'none'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig
