'use client'

import { useState, useCallback } from 'react'
import { FolderOpen, Play, ChevronRight, Loader2 } from 'lucide-react'
import { YearTabs } from '@/components/ui/YearTabs'
import { DriveImage } from '@/components/ui/DriveImage'
import { WatermarkLogo } from '@/components/ui/WatermarkLogo'
import { Lightbox } from '@/app/(public)/galeria/components/Lightbox'
import { cn } from '@/lib/shadcn-utils'
import type { DriveItem } from '@/lib/google-drive'

interface YearFolder {
  id: string
  name: string
}

interface GaleriaTabsProps {
  years: YearFolder[]
}

const PER_PAGE = 24

const isVideo = (m: string) => m.startsWith('video/')
const isMedia = (i: DriveItem) =>
  !i.isFolder && (i.mimeType.startsWith('image/') || i.mimeType.startsWith('video/'))

const fetchFolder = async (folderId: string): Promise<DriveItem[]> => {
  const res = await fetch(`/api/drive/files?folderId=${folderId}`)
  if (!res.ok) return []
  const json = await res.json()
  return (json.items ?? []) as DriveItem[]
}

const GaleriaTabs = ({ years }: GaleriaTabsProps) => {
  const [activeYear, setActiveYear] = useState<string | null>(null)
  // Cache de subcarpetas por año
  const [subfolders, setSubfolders] = useState<Record<string, DriveItem[]>>({})
  const [loadingSubs, setLoadingSubs] = useState(false)

  // Álbum seleccionado y sus archivos
  const [album, setAlbum] = useState<{ id: string; name: string } | null>(null)
  const [files, setFiles] = useState<DriveItem[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [page, setPage] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const tabs = years.map((y) => ({ key: y.id, label: y.name }))

  const seleccionarAnio = useCallback(
    async (yearId: string) => {
      // Toggle: si ya estaba activo, cerrar
      if (activeYear === yearId) {
        setActiveYear(null)
        return
      }
      setActiveYear(yearId)
      setAlbum(null)
      setFiles([])
      if (!subfolders[yearId]) {
        setLoadingSubs(true)
        const items = await fetchFolder(yearId)
        setSubfolders((prev) => ({ ...prev, [yearId]: items.filter((i) => i.isFolder) }))
        setLoadingSubs(false)
      }
    },
    [activeYear, subfolders]
  )

  const seleccionarAlbum = useCallback(async (folder: DriveItem, close: () => void) => {
    setAlbum({ id: folder.id, name: folder.name })
    setPage(0)
    setLoadingFiles(true)
    close() // cerrar el dropdown al elegir álbum
    const items = await fetchFolder(folder.id)
    setFiles(items)
    setLoadingFiles(false)
  }, [])

  // Dropdown: subcarpetas del año
  const renderDropdown = (yearId: string, close: () => void) => {
    const subs = subfolders[yearId]
    if (loadingSubs && !subs) {
      return (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando álbumes...
        </div>
      )
    }
    if (!subs || subs.length === 0) {
      return <div className="px-4 py-3 text-sm text-neutral-500">Sin álbumes en este año.</div>
    }
    return (
      <ul className="max-h-72 overflow-y-auto py-1">
        {subs.map((sub) => (
          <li key={sub.id}>
            <button
              type="button"
              onClick={() => seleccionarAlbum(sub, close)}
              className={cn(
                'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary-50',
                album?.id === sub.id ? 'bg-primary-50 font-semibold text-primary-700' : 'text-neutral-700'
              )}
            >
              <FolderOpen className="h-4 w-4 shrink-0 text-primary-500" />
              <span className="truncate">{sub.name}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  const media = files.filter(isMedia)
  const totalPages = Math.ceil(media.length / PER_PAGE)
  const pagedMedia = media.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const mediaOffset = page * PER_PAGE

  return (
    <>
      <YearTabs
        tabs={tabs}
        activeKey={activeYear}
        onSelect={seleccionarAnio}
        accent="primary"
        dropdown={renderDropdown}
        invitation="Selecciona un año y luego un álbum para ver las fotos y videos de esa actividad."
      >
        {/* Contenido del recuadro: álbum seleccionado */}
        {!album ? (
          <div className="flex items-center justify-center gap-2 py-12 text-center text-sm text-neutral-500">
            <ChevronRight className="h-4 w-4" />
            Abre el menú del año y elige un álbum.
          </div>
        ) : loadingFiles ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <p className="py-10 text-center text-neutral-500">Este álbum no tiene fotos todavía.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-800">{album.name}</h3>
              <span className="text-sm text-neutral-500">
                {media.length} archivo{media.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {pagedMedia.map((item, idx) => {
                const realIdx = mediaOffset + idx
                const vid = isVideo(item.mimeType)
                return (
                  <div
                    key={item.id}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-neutral-200 shadow-sm"
                    onClick={() => setLightboxIdx(realIdx)}
                  >
                    <DriveImage
                      id={item.id}
                      alt={item.name}
                      size="w600"
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <WatermarkLogo className="h-7 sm:h-9" />
                    {vid && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                        <Play className="h-8 w-8 fill-white text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 enabled:hover:bg-neutral-50 disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-sm text-neutral-500">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 enabled:hover:bg-neutral-50 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </YearTabs>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          media={media}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : media.length - 1))}
          onNext={() => setLightboxIdx((i) => (i !== null && i < media.length - 1 ? i + 1 : 0))}
        />
      )}
    </>
  )
}

export { GaleriaTabs }
