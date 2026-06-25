'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/shadcn-utils'

interface TabItem {
  key: string
  label: string
}

interface YearTabsProps {
  tabs: TabItem[]
  activeKey: string | null
  onSelect: (key: string) => void
  /** Mensaje en el recuadro cuando no hay tab activo */
  invitation: string
  /** Variante de color del acento */
  accent?: 'primary' | 'gold'
  /** Si se provee, al abrir un tab se muestra este panel anclado bajo el tab (ancho del tab).
   *  `close` permite cerrar el dropdown (p.ej. al elegir un ítem). */
  dropdown?: (key: string, close: () => void) => ReactNode
  /** Contenido del recuadro cuando hay tab activo */
  children?: ReactNode
}

const ACCENT_ACTIVE: Record<string, string> = {
  primary: 'bg-primary-600 text-white shadow-md',
  gold: 'bg-yellow-400 text-yellow-950 shadow-md',
}

const ACCENT_INACTIVE: Record<string, string> = {
  primary: 'bg-white text-primary-700 hover:bg-primary-50 border-primary-200',
  gold: 'bg-white text-yellow-800 hover:bg-yellow-50 border-yellow-200',
}

const YearTabs = ({
  tabs,
  activeKey,
  onSelect,
  invitation,
  accent = 'primary',
  dropdown,
  children,
}: YearTabsProps) => {
  // Qué dropdown está abierto (desacoplado del tab activo/contenido)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const closeDropdown = () => setOpenKey(null)

  const handleTabClick = (key: string) => {
    onSelect(key)
    if (dropdown) {
      setOpenKey((prev) => (prev === key ? null : key))
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.key === activeKey
          const isOpen = tab.key === openKey
          return (
            <div key={tab.key} className="relative">
              <button
                type="button"
                onClick={() => handleTabClick(tab.key)}
                aria-expanded={isOpen}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-base font-bold transition-all',
                  active ? ACCENT_ACTIVE[accent] : ACCENT_INACTIVE[accent]
                )}
              >
                {tab.label}
                {dropdown && (
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
                  />
                )}
              </button>

              {/* Dropdown anclado bajo el tab, ancho del tab */}
              {dropdown && isOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 min-w-max overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
                  {dropdown(tab.key, closeDropdown)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Recuadro */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        {activeKey === null ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-neutral-500">
            <MousePointerClick className="h-9 w-9 text-neutral-300" />
            <p className="max-w-md text-sm">{invitation}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export { YearTabs }
export type { TabItem }
