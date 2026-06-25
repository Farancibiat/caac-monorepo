'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ImageOff, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/shadcn-utils'

type DriveImageSize = 'w600' | 'w1000' | 'w1600'

interface DriveImageProps {
  id: string
  alt: string
  size?: DriveImageSize
  className?: string
  /** Clases para el contenedor (aspect ratio, etc.) */
  wrapperClassName?: string
  onClick?: () => void
  /** Carga inmediata (sin lazy) — útil para imagen grande del lightbox */
  eager?: boolean
}

const MAX_AUTO_RETRIES = 1
const RETRY_DELAYS = [800]

// Proxy propio (mismo origen + cache) — evita el 429/ORB de lh3.googleusercontent.com
const thumbnailUrl = (id: string, size: DriveImageSize) =>
  `/api/drive/thumbnail?id=${id}&sz=${size}`

const DriveImage = ({
  id,
  alt,
  size = 'w600',
  className,
  wrapperClassName,
  onClick,
  eager = false,
}: DriveImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  // attempt cambia la URL (cache-buster) para forzar recarga del <img>
  const [attempt, setAttempt] = useState(0)
  const autoRetriesRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleError = useCallback(() => {
    if (autoRetriesRef.current < MAX_AUTO_RETRIES) {
      const delay = RETRY_DELAYS[autoRetriesRef.current] ?? 1200
      autoRetriesRef.current += 1
      setStatus('loading')
      timerRef.current = setTimeout(() => setAttempt((a) => a + 1), delay)
    } else {
      setStatus('error')
    }
  }, [])

  const handleManualRetry = useCallback(() => {
    autoRetriesRef.current = 0
    setStatus('loading')
    setAttempt((a) => a + 1)
  }, [])

  return (
    <div className={cn('relative overflow-hidden bg-neutral-100', wrapperClassName)}>
      {/* Skeleton mientras carga */}
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 to-neutral-100" />
      )}

      {/* Estado de error con botón reintentar */}
      {status === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100 p-3 text-center">
          <ImageOff className="h-7 w-7 text-neutral-400" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleManualRetry()
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Reintentar
          </button>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={attempt}
          src={thumbnailUrl(id, size)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onClick={onClick}
          onLoad={() => setStatus('loaded')}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            className
          )}
        />
      )}
    </div>
  )
}

export { DriveImage }
export type { DriveImageSize }
