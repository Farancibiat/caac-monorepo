import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | CAAChiloé',
    default: 'Club de Aguas Abiertas Chiloé'
  },
  description: 'Club de Aguas Abiertas Chiloé. Reserva tu horario de piscina y únete a nuestros eventos.',
  keywords: ['natación', 'aguas abiertas', 'chiloé', 'club', 'piscina', 'reservas'],
  authors: [{ name: 'Club de Aguas Abiertas Chiloé' }],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://www.aguasabiertaschiloe.cl',
    siteName: 'Sitio Oficial del Club de Aguas Abiertas Chiloé',
    title: 'Club de Aguas Abiertas Chiloé',
    description: 'Club de Aguas Abiertas de Chiloé',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club de Aguas Abiertas Chiloé',
    description: 'Club de Aguas Abiertas de Chiloé',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
          {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID} />
          )}
        </AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout
