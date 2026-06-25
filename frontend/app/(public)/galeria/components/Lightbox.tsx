'use client'

import { useState, useEffect } from 'react'
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SwimmingLoader from '@/components/ui/SwimmingLoader'
import { WatermarkLogo } from '@/components/ui/WatermarkLogo'
import type { DriveItem } from '@/lib/google-drive'

interface LightboxProps {
  media: DriveItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

// Fotos: descarga con marca de agua (server-side). Videos: descarga directa de Drive.
const downloadUrl = (item: DriveItem) =>
  item.mimeType.startsWith('video/')
    ? `https://drive.google.com/uc?export=download&id=${item.id}`
    : `/api/drive/download?id=${item.id}&name=${encodeURIComponent(item.name)}`

const videoEmbedUrl = (id: string) =>
  `https://drive.google.com/file/d/${id}/preview`

const fullImageUrl = (id: string) =>
  `/api/drive/thumbnail?id=${id}&sz=w1600`

const isVideo = (mimeType: string) => mimeType.startsWith('video/')

const Lightbox = ({ media, index, onClose, onPrev, onNext }: LightboxProps) => {
  const current = media[index]
  const esVideo = current ? isVideo(current.mimeType) : false
  const [imgCargada, setImgCargada] = useState(false)

  // Reset loader al cambiar de imagen
  useEffect(() => {
    setImgCargada(false)
  }, [index])

  // Navegación con teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        type="button"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Anterior"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      <button
        type="button"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Siguiente"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      {/* Media */}
      <div
        className="flex max-h-[85vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {esVideo ? (
          <div className="relative">
            <iframe
              src={videoEmbedUrl(current.id)}
              className="rounded-lg"
              style={{ width: 'min(90vw, 960px)', height: 'min(85vh, 540px)' }}
              allowFullScreen
            />
            <WatermarkLogo className="h-12" />
          </div>
        ) : (
          <div className="relative inline-flex">
            {!imgCargada && (
              <div className="absolute inset-0 flex items-center justify-center">
                <SwimmingLoader size={70} />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullImageUrl(current.id)}
              alt={current.name}
              onLoad={() => setImgCargada(true)}
              className={`max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${imgCargada ? 'opacity-100' : 'opacity-0'}`}
            />
            {imgCargada && <WatermarkLogo className="h-14" />}
          </div>
        )}
      </div>

      {/* Barra inferior */}
      <div
        className="absolute bottom-6 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {index + 1} / {media.length}
        </span>
        <Button
          asChild
          size="sm"
          className="bg-accent-400 font-semibold text-accent-900 hover:bg-accent-500"
        >
          <a href={downloadUrl(current)} download={current.name} target="_blank" rel="noopener noreferrer">
            <Download className="mr-1.5 h-4 w-4" />
            Descargar
          </a>
        </Button>
      </div>
    </div>
  )
}

export { Lightbox }
