'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Calendar, MapPin, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/shadcn-utils'
import type { CalendarioEvento, TipoEvento } from '@/types/calendario-evento'
import { TIPO_EVENTO_LABEL } from '@/types/calendario-evento'
import { CALENDARIO_EVENTOS } from '@/data/calendario-eventos'

const TODOS = 'todos'

// Pill de color por tipo
const TIPO_PILL: Record<string, string> = {
  'piscina': 'bg-ocean-100 text-ocean-800',
  'aguas-abiertas': 'bg-primary-100 text-primary-800',
  'triathlon': 'bg-accent-100 text-accent-900',
}

// Borde-acento izquierdo por tipo
const TIPO_BORDE: Record<string, string> = {
  'piscina': 'border-l-ocean-400',
  'aguas-abiertas': 'border-l-primary-400',
  'triathlon': 'border-l-accent-400',
}

const FILTROS: Array<{ value: string; label: string }> = [
  { value: TODOS, label: 'Todos' },
  { value: 'aguas-abiertas', label: 'Aguas Abiertas' },
  { value: 'piscina', label: 'Piscina' },
  { value: 'triathlon', label: 'Triatlón' },
]

const columnHelper = createColumnHelper<CalendarioEvento>()

const TipoPill = ({ tipo }: { tipo: TipoEvento }) => (
  <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold', TIPO_PILL[tipo])}>
    {TIPO_EVENTO_LABEL[tipo]}
  </span>
)

const CalendarioEventos = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'fecha', desc: false }])
  const [tipo, setTipo] = useState(TODOS)
  const [busqueda, setBusqueda] = useState('')
  // Datos estáticos como valor inicial (sin parpadeo); se reemplazan con los de la planilla.
  const [eventos, setEventos] = useState<CalendarioEvento[]>(CALENDARIO_EVENTOS)

  useEffect(() => {
    let activo = true
    fetch('/api/eventos')
      .then((r) => r.json())
      .then((data: { eventos?: CalendarioEvento[] }) => {
        if (activo && Array.isArray(data.eventos) && data.eventos.length > 0) {
          setEventos(data.eventos)
        }
      })
      .catch(() => {/* se mantienen los datos estáticos */})
    return () => {
      activo = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = busqueda.toLowerCase()
    return eventos.filter((ev) => {
      if (tipo !== TODOS && ev.tipo !== tipo) return false
      if (q && !ev.nombre.toLowerCase().includes(q) && !ev.ubicacion.toLowerCase().includes(q)) return false
      return true
    })
  }, [eventos, tipo, busqueda])

  const columns = useMemo(
    () => [
      columnHelper.accessor('fecha', {
        header: 'Fecha',
        cell: (info) => <span className="whitespace-nowrap font-medium text-neutral-800">{info.row.original.fechaDisplay}</span>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor('nombre', {
        header: 'Evento',
        cell: (info) => <span className="font-semibold text-primary-800">{info.getValue()}</span>,
      }),
      columnHelper.accessor('ubicacion', {
        header: 'Ubicación',
        cell: (info) => <span className="text-neutral-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('tipo', {
        header: 'Tipo',
        cell: (info) => <TipoPill tipo={info.getValue()} />,
        sortingFn: 'alphanumeric',
      }),
      columnHelper.accessor('distancias', {
        header: 'Distancias',
        enableSorting: false,
        cell: (info) => <span className="text-sm text-neutral-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('webInscripciones', {
        header: 'Inscripciones',
        enableSorting: false,
        cell: (info) => {
          const url = info.getValue()
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Inscribirse
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-neutral-300">—</span>
          )
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-5">
      {/* Toolbar: segmented control + búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap gap-1 rounded-full bg-neutral-100 p-1">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setTipo(f.value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
                tipo === f.value
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            className="h-10 rounded-full pl-9"
            placeholder="Buscar evento o lugar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop: tabla compacta */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead key={header.id} className="h-10 whitespace-nowrap text-xs uppercase tracking-wide text-neutral-500">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={cn(
                            'inline-flex items-center gap-1 font-semibold hover:text-primary-700',
                            canSort && 'cursor-pointer select-none'
                          )}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          disabled={!canSort}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort &&
                            (sorted === 'desc' ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : sorted === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                            ))}
                        </button>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-20 text-center text-neutral-500">
                  No hay eventos con los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    'border-l-4 border-neutral-100 transition-colors hover:bg-primary-50/40',
                    TIPO_BORDE[row.original.tipo]
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: tarjetas apiladas */}
      <div className="space-y-3 md:hidden">
        {table.getRowModel().rows.length === 0 ? (
          <p className="py-10 text-center text-neutral-500">No hay eventos con los filtros seleccionados.</p>
        ) : (
          table.getRowModel().rows.map((row) => {
            const ev = row.original
            return (
              <div
                key={row.id}
                className={cn(
                  'rounded-xl border border-l-4 border-neutral-200 bg-white p-4 shadow-sm',
                  TIPO_BORDE[ev.tipo]
                )}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-primary-800">{ev.nombre}</h3>
                  <TipoPill tipo={ev.tipo} />
                </div>
                <div className="space-y-1.5 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    {ev.fechaDisplay}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-500" />
                    {ev.ubicacion}
                  </div>
                  <p className="pt-1 text-neutral-500">{ev.distancias}</p>
                </div>
                {ev.webInscripciones && (
                  <a
                    href={ev.webInscripciones}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                  >
                    Inscribirse
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export { CalendarioEventos }
