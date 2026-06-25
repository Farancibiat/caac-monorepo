import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_SIZES = new Set(['w600', 'w1000', 'w1600'])

/**
 * Proxy de thumbnails de Drive. Baja la miniatura server-side (donde el fetch
 * sigue el 302 a lh3.googleusercontent.com sin el rate-limit/ORB del navegador)
 * y la sirve desde nuestro dominio con cache de larga duración.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const sz = req.nextUrl.searchParams.get('sz') ?? 'w600'

  if (!id) {
    return new NextResponse('Missing id', { status: 400 })
  }
  if (!ALLOWED_SIZES.has(sz)) {
    return new NextResponse('Invalid size', { status: 400 })
  }

  try {
    const upstream = await fetch(
      `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=${sz}`,
      { redirect: 'follow' }
    )

    if (!upstream.ok || !upstream.body) {
      return new NextResponse('Upstream error', { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache agresivo: cada thumbnail se baja de Google una sola vez (navegador + CDN Vercel)
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('[drive/thumbnail]', err)
    return new NextResponse('Error fetching thumbnail', { status: 502 })
  }
}
