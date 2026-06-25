'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { DriveImage } from '@/components/ui/DriveImage'
import { cn } from '@/lib/shadcn-utils'

const CANTIDAD = 4
const INTERVALO_MS = 5000

// Baraja (Fisher-Yates) y toma n elementos
const tomarAleatorias = (arr: string[], n: number) => {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia.slice(0, n)
}

const DesafioCarousel = () => {
  const [ids, setIds] = useState<string[]>([])
  const [actual, setActual] = useState(0)
  const [cargado, setCargado] = useState(false)
  const [fallo, setFallo] = useState(false)
  const pausadoRef = useRef(false)

  // Cargar fotos del desafío 2026 (random en cada montaje/recarga)
  useEffect(() => {
    let activo = true
    fetch('/api/drive/featured')
      .then((r) => r.json())
      .then((data: { ids?: string[] }) => {
        if (!activo) return
        const lista = data.ids ?? []
        if (lista.length === 0) {
          setFallo(true)
        } else {
          setIds(tomarAleatorias(lista, CANTIDAD))
        }
        setCargado(true)
      })
      .catch(() => {
        if (!activo) return
        setFallo(true)
        setCargado(true)
      })
    return () => {
      activo = false
    }
  }, [])

  // Auto-avance
  useEffect(() => {
    if (ids.length <= 1) return
    const timer = setInterval(() => {
      if (!pausadoRef.current) {
        setActual((i) => (i + 1) % ids.length)
      }
    }, INTERVALO_MS)
    return () => clearInterval(timer)
  }, [ids.length])

  // Fallback: imagen estática si no hay fotos o falló el fetch
  if (fallo || (cargado && ids.length === 0)) {
    return (
      <div className="relative min-h-[280px] overflow-hidden bg-ocean-100">
        <Image
          src="/assets/galeria-card.webp"
          alt="Club de Aguas Abiertas Chiloé — momentos del club"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ocean-200/40">
          <Camera className="h-16 w-16 text-ocean-400/60" />
        </div>
      </div>
    )
  }

  // Skeleton mientras carga el listado
  if (!cargado) {
    return <div className="min-h-[280px] animate-pulse bg-ocean-100" />
  }

  return (
    <div
      className="relative min-h-[280px] overflow-hidden bg-ocean-100"
      onMouseEnter={() => (pausadoRef.current = true)}
      onMouseLeave={() => (pausadoRef.current = false)}
    >
      {/* Slides */}
      {ids.map((id, idx) => (
        <div
          key={id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            idx === actual ? 'opacity-100' : 'opacity-0'
          )}
        >
          <DriveImage
            id={id}
            alt={`Foto del Desafío Unión de las Islas ${idx + 1}`}
            size="w1000"
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover"
            eager={idx === 0}
          />
        </div>
      ))}

      {/* Puntos */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {ids.map((id, idx) => (
          <button
            key={id}
            type="button"
            aria-label={`Ver foto ${idx + 1}`}
            onClick={() => setActual(idx)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300',
              idx === actual ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export { DesafioCarousel }
