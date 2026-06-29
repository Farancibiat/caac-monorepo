import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getDriveClient } from '@/lib/google-drive'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Logo cacheado en memoria (se lee una vez por instancia)
let logoBuffer: Buffer | null = null
const getLogo = () => {
  if (!logoBuffer) {
    logoBuffer = readFileSync(path.join(process.cwd(), 'public', 'assets', 'circular-transparent.svg'))
  }
  return logoBuffer
}

const WATERMARK_OPACITY = 0.85
const MARGIN = 24 // px desde el borde

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const name = req.nextUrl.searchParams.get('name') ?? 'foto.jpg'

  if (!id) return new NextResponse('Missing id', { status: 400 })
  if (!process.env.GOOGLE_API_KEY) return new NextResponse('Drive not configured', { status: 503 })

  try {
    // Descargar el archivo original desde Drive
    const drive = getDriveClient()
    const res = await drive.files.get(
      { fileId: id, alt: 'media', supportsAllDrives: true },
      { responseType: 'arraybuffer' }
    )
    const original = Buffer.from(res.data as ArrayBuffer)

    const base = sharp(original).rotate() // respeta orientación EXIF
    const meta = await base.metadata()
    const w = meta.width ?? 1200
    const h = meta.height ?? 900

    // Tamaño del logo: cabe dentro de un recuadro proporcional (no domina la foto)
    const boxW = Math.round(w * 0.16)
    const boxH = Math.round(h * 0.22)

    // Redimensionar el logo y aplicarle opacidad
    const logoResized = await sharp(getLogo())
      .resize({ width: boxW, height: boxH, fit: 'inside' })
      .ensureAlpha()
      .composite([
        {
          // Reduce la opacidad del logo multiplicando su canal alfa
          input: Buffer.from([255, 255, 255, Math.round(255 * WATERMARK_OPACITY)]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer()

    const logoMeta = await sharp(logoResized).metadata()
    const left = Math.max(0, w - (logoMeta.width ?? boxW) - MARGIN)
    const top = Math.max(0, h - (logoMeta.height ?? boxH) - MARGIN)

    const output = await base
      .composite([{ input: logoResized, left, top }])
      .jpeg({ quality: 90 })
      .toBuffer()

    const safeName = name.replace(/\.[^.]+$/, '') + '.jpg'

    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('[drive/download]', err)
    return new NextResponse('Error procesando la descarga', { status: 502 })
  }
}
