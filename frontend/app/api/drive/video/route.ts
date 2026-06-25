import { NextRequest, NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/google-drive'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get('id')
  if (!fileId) {
    return new NextResponse('Missing id param', { status: 400 })
  }

  if (!process.env.GOOGLE_API_KEY) {
    return new NextResponse('Drive not configured', { status: 503 })
  }

  try {
    const drive = getDriveClient()

    // Get file metadata for size and mime type
    const meta = await drive.files.get({ fileId, fields: 'size,mimeType', supportsAllDrives: true })
    const totalSize = parseInt(meta.data.size ?? '0', 10)
    const mimeType = meta.data.mimeType ?? 'video/mp4'

    const rangeHeader = req.headers.get('range')

    let start = 0
    let end = totalSize - 1

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/)
      if (match) {
        start = parseInt(match[1], 10)
        end = match[2] ? parseInt(match[2], 10) : totalSize - 1
      }
    }

    const chunkSize = end - start + 1

    // Fetch the file content as a stream
    const driveRes = await drive.files.get(
      { fileId, alt: 'media', supportsAllDrives: true },
      {
        responseType: 'stream',
        headers: rangeHeader ? { Range: `bytes=${start}-${end}` } : {},
      }
    )

    // driveRes.data is a Node.js Readable when responseType is 'stream'
    const nodeStream = driveRes.data as unknown as NodeJS.ReadableStream

    // Convert Node.js stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => controller.enqueue(chunk))
        nodeStream.on('end', () => controller.close())
        nodeStream.on('error', (err: Error) => controller.error(err))
      },
      cancel() {
        (nodeStream as NodeJS.ReadableStream & { destroy?: () => void }).destroy?.()
      },
    })

    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    }

    if (rangeHeader) {
      headers['Content-Range'] = `bytes ${start}-${end}/${totalSize}`
      headers['Content-Length'] = String(chunkSize)
      return new NextResponse(webStream, { status: 206, headers })
    }

    headers['Content-Length'] = String(totalSize)
    return new NextResponse(webStream, { status: 200, headers })
  } catch (err) {
    console.error('[drive/video]', err)
    return new NextResponse('Error fetching video', { status: 500 })
  }
}
