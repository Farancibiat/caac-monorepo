import { NextRequest, NextResponse } from 'next/server'
import { listDriveFolder } from '@/lib/google-drive'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const folderId = req.nextUrl.searchParams.get('folderId')
  if (!folderId) {
    return NextResponse.json({ error: 'Missing folderId param' }, { status: 400 })
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Drive not configured' }, { status: 503 })
  }

  try {
    const items = await listDriveFolder(folderId)
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
  } catch (err) {
    console.error('[drive/files]', err)
    return NextResponse.json({ error: 'Error listing folder' }, { status: 500 })
  }
}
