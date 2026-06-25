'use client'

import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { ResultadoDesafioFila } from '@/types/evento-historico'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/shadcn-utils'
import { distanciaRowClass, ordenCategoria } from '@/lib/distancia-estilos'

const columnHelper = createColumnHelper<ResultadoDesafioFila>()

const TODOS = 'todos'

// 1º/2º/3º → medallas; resto → número
const medalla = (pos: number) => {
  if (pos === 1) return '🥇'
  if (pos === 2) return '🥈'
  if (pos === 3) return '🥉'
  return pos > 0 ? String(pos) : '—'
}

interface ResultadosDesafioTableProps {
  data: ResultadoDesafioFila[]
  notaMock?: string
}

export function ResultadosDesafioTable({ data, notaMock }: ResultadosDesafioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [genero, setGenero] = useState(TODOS)
  const [categoria, setCategoria] = useState(TODOS)
  const [distancia, setDistancia] = useState(TODOS)

  const opcionesGenero = useMemo(() => [...new Set(data.map((r) => r.genero))].sort(), [data])
  const opcionesCategoria = useMemo(() => [...new Set(data.map((r) => r.categoria))].sort(), [data])
  const opcionesDistancia = useMemo(() => [...new Set(data.map((r) => r.distancia))].sort(), [data])

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (genero !== TODOS && row.genero !== genero) return false
      if (categoria !== TODOS && row.categoria !== categoria) return false
      if (distancia !== TODOS && row.distancia !== distancia) return false
      return true
    })
  }, [data, genero, categoria, distancia])

  const columns = useMemo(
    () => [
      columnHelper.accessor('posGeneral', {
        header: 'Pos. Gral',
        cell: (info) => <span className="block text-center text-base">{medalla(info.getValue())}</span>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor('posCategoria', {
        header: 'Pos. Cat',
        cell: (info) => <span className="block text-center text-base">{medalla(info.getValue())}</span>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor('nombre', { header: 'Nadador' }),
      columnHelper.accessor('genero', { header: 'Género' }),
      columnHelper.accessor('categoria', {
        header: 'Categoría',
        sortingFn: (a, b) => ordenCategoria(a.original.categoria) - ordenCategoria(b.original.categoria),
      }),
      columnHelper.accessor('distancia', { header: 'Distancia' }),
      columnHelper.accessor('tiempoSegundos', {
        id: 'tiempo',
        header: 'Tiempo',
        cell: (info) => <span className="font-mono">{info.row.original.tiempo}</span>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor('ritmo', {
        header: 'Ritmo /100m',
        enableSorting: false,
        cell: (info) => <span className="font-mono text-neutral-600">{info.getValue()}</span>,
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

  const resetFiltros = () => {
    setGenero(TODOS)
    setCategoria(TODOS)
    setDistancia(TODOS)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-neutral-600">Género</span>
          <Select value={genero} onValueChange={setGenero}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {opcionesGenero.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-neutral-600">Categoría</span>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas</SelectItem>
              {opcionesCategoria.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-neutral-600">Distancia</span>
          <Select value={distancia} onValueChange={setDistancia}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Distancia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas</SelectItem>
              {opcionesDistancia.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" size="sm" className="h-9" onClick={resetFiltros}>
          Limpiar filtros
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={cn(
                            'inline-flex items-center gap-1 font-semibold hover:text-primary-700',
                            canSort && 'cursor-pointer select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-neutral-500">
                  No hay filas con los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={distanciaRowClass(row.original.distancia)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {notaMock ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{notaMock}</p>
      ) : null}
    </div>
  )
}
