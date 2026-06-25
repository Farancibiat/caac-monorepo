import { NextResponse } from 'next/server'
import { listDriveFolder } from '@/lib/google-drive'

export const revalidate = 3600

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_GALLERY_ROOT_ID ?? ''

/**
 * Devuelve los IDs de las fotos del Desafío 2026 para el carousel del home.
 * Navega: raíz → carpeta "2026" → subcarpeta que contenga "desaf" → imágenes.
 */
export async function GET() {
  if (!ROOT_FOLDER_ID || !process.env.GOOGLE_API_KEY) {
    return NextResponse.json({ ids: [] })
  }

  try {
    // 1. Buscar la carpeta del año 2026
    const root = await listDriveFolder(ROOT_FOLDER_ID)
    const anio2026 = root.find((i) => i.isFolder && i.name.includes('2026'))
    if (!anio2026) return NextResponse.json({ ids: [] })

    // 2. Buscar la subcarpeta del desafío dentro de 2026
    const subcarpetas = await listDriveFolder(anio2026.id)
    const desafio = subcarpetas.find(
      (i) => i.isFolder && i.name.toLowerCase().includes('desaf')
    )
    if (!desafio) return NextResponse.json({ ids: [] })

    // 3. Listar imágenes de la carpeta del desafío
    const archivos = await listDriveFolder(desafio.id)
    const ids = archivos
      .filter((f) => !f.isFolder && f.mimeType.startsWith('image/'))
      .map((f) => f.id)

    return NextResponse.json(
      { ids },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('[drive/featured]', err)
    return NextResponse.json({ ids: [] })
  }
}
