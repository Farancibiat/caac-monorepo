import { Metadata } from 'next'
import { ImageIcon } from 'lucide-react'
import { GaleriaTabs } from '@/app/(public)/galeria/components/GaleriaTabs'
import { listDriveFolder } from '@/lib/google-drive'

export const metadata: Metadata = {
  title: 'Galería',
  description:
    'Galería de fotos y videos del Club de Aguas Abiertas Chiloé: clínicas, desafíos y travesías en las aguas de Chiloé.',
  keywords: ['galería', 'fotos', 'Google Drive', 'aguas abiertas', 'Chiloé'],
}

export const revalidate = 3600

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_GALLERY_ROOT_ID ?? ''
const driveConfigured = Boolean(ROOT_FOLDER_ID && process.env.GOOGLE_API_KEY)

const GaleriaPage = async () => {
  let years: { id: string; name: string }[] = []
  if (driveConfigured) {
    try {
      const root = await listDriveFolder(ROOT_FOLDER_ID)
      years = root
        .filter((i) => i.isFolder)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => ({ id: f.id, name: f.name }))
    } catch (err) {
      console.error('[galeria] error listando años:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-4 text-center">
          <h1 className="text-4xl font-bold text-primary-800 text-club-shadow">Galería</h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-700">
            Explora las fotos y videos de cada actividad del club. Elige un año y luego un álbum.
          </p>
          <div className="mx-auto h-2 w-32 rounded-full bg-club-gradient" />
        </header>

        {!driveConfigured ? (
          <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-amber-400" />
            <p className="font-semibold text-amber-800">Galería en configuración</p>
            <p className="mt-1 text-sm text-amber-700">
              Estamos preparando el acceso a nuestra galería de fotos. Vuelve pronto.
            </p>
          </div>
        ) : years.length === 0 ? (
          <p className="py-12 text-center text-neutral-500">No se encontraron álbumes todavía.</p>
        ) : (
          <GaleriaTabs years={years} />
        )}
      </div>
    </div>
  )
}

export default GaleriaPage
