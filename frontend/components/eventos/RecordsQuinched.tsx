'use client'

import { useEffect, useMemo, useState } from 'react'
import { Trophy, Crown } from 'lucide-react'
import { calcularRecordsQuinched, recordsGenerales, type RecordQuinched } from '@/lib/records-quinched'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { distanciaRowClass, distanciaAccent, ordenCategoria } from '@/lib/distancia-estilos'
import { cn } from '@/lib/shadcn-utils'
import type { ResultadoDesafioFila } from '@/types/evento-historico'

// Cards de records generales: de mayor a menor distancia
const DISTANCIAS = ['3,5 km', '1,3 km', '0,5 km']
const TODOS = 'todos'

const RecordCard = ({ record }: { record?: RecordQuinched }) => {
  if (!record) return <p className="text-sm text-neutral-400">Sin registro</p>
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-neutral-800">{record.nombre}</p>
        <p className="text-xs text-neutral-500">{record.categoria} · {record.anio}</p>
      </div>
      <span className="shrink-0 font-mono text-sm font-bold text-neutral-900">{record.tiempo}</span>
    </div>
  )
}

const RecordsQuinched = () => {
  // Datos por año desde la planilla (fallback: estáticos vía calcularRecordsQuinched()).
  const [porAnio, setPorAnio] = useState<Record<string, ResultadoDesafioFila[]> | null>(null)

  useEffect(() => {
    let activo = true
    fetch('/api/resultados')
      .then((r) => r.json())
      .then((data: { resultados?: Record<string, ResultadoDesafioFila[]> }) => {
        if (activo && data.resultados) setPorAnio(data.resultados)
      })
      .catch(() => {/* se mantiene el fallback estático */})
    return () => {
      activo = false
    }
  }, [])

  const records = useMemo(() => calcularRecordsQuinched(porAnio ?? undefined), [porAnio])
  const generales = useMemo(() => recordsGenerales(records), [records])

  const [distancia, setDistancia] = useState(TODOS)
  const [genero, setGenero] = useState(TODOS)
  const [categoria, setCategoria] = useState(TODOS)

  const opcionesCategoria = useMemo(
    () => [...new Set(records.map((r) => r.categoria))].sort((a, b) => ordenCategoria(a) - ordenCategoria(b)),
    [records]
  )

  const filtrados = useMemo(
    () =>
      records.filter((r) => {
        if (distancia !== TODOS && r.distancia !== distancia) return false
        if (genero !== TODOS && r.genero !== genero) return false
        if (categoria !== TODOS && r.categoria !== categoria) return false
        return true
      }),
    [records, distancia, genero, categoria]
  )

  const generalDe = (dist: string, gen: string) =>
    generales.find((r) => r.distancia === dist && r.genero === gen)

  const limpiar = () => {
    setDistancia(TODOS)
    setGenero(TODOS)
    setCategoria(TODOS)
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500 drop-shadow-sm" />
        <div>
          <h2 className="text-3xl font-bold text-primary-800">Records del Desafío Quinched</h2>
          <p className="mt-1 text-neutral-600">
            Mejores tiempos históricos por distancia, categoría y género — ediciones 2023, 2024 y 2026.
          </p>
        </div>
      </div>

      {/* Records generales por distancia (mejor absoluto por sexo) */}
      {generales.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {DISTANCIAS.map((dist) => {
            const accent = distanciaAccent(dist)
            const esInsignia = dist === '3,5 km'
            return (
              <div
                key={dist}
                className={cn(
                  'rounded-2xl border p-5 shadow-sm',
                  accent.card,
                  esInsignia && 'ring-2 ring-yellow-400 shadow-md'
                )}
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className={cn('h-3 w-3 rounded-full', accent.punto)} />
                  <h3 className={cn('text-lg font-bold', accent.texto)}>{dist}</h3>
                  {esInsignia && <Trophy className="ml-auto h-5 w-5 text-yellow-500" />}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Femenino
                    </p>
                    <RecordCard record={generalDe(dist, 'Femenino')} />
                  </div>
                  <div className="border-t border-black/5 pt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Masculino
                    </p>
                    <RecordCard record={generalDe(dist, 'Masculino')} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detalle por categoría de edad */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-primary-800">Por categoría de edad</h3>

        {/* Filtros */}
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-neutral-600">Distancia</span>
            <Select value={distancia} onValueChange={setDistancia}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas</SelectItem>
                <SelectItem value="0,5 km">0,5 km</SelectItem>
                <SelectItem value="1,3 km">1,3 km</SelectItem>
                <SelectItem value="3,5 km">3,5 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-neutral-600">Género</span>
            <Select value={genero} onValueChange={setGenero}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-neutral-600">Categoría</span>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas</SelectItem>
                {opcionesCategoria.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-9" onClick={limpiar}>
            Limpiar
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="font-bold text-neutral-700">Distancia</TableHead>
                <TableHead className="font-bold text-neutral-700">Categoría</TableHead>
                <TableHead className="font-bold text-neutral-700">Género</TableHead>
                <TableHead className="font-bold text-neutral-700">Nadador</TableHead>
                <TableHead className="font-bold text-neutral-700">Tiempo</TableHead>
                <TableHead className="font-bold text-neutral-700">Ritmo /100m</TableHead>
                <TableHead className="font-bold text-neutral-700">Año</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-neutral-500">
                    No hay records con los filtros seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                filtrados.map((r, idx) => (
                  <TableRow key={idx} className={distanciaRowClass(r.distancia)}>
                    <TableCell className="font-medium text-neutral-800">{r.distancia}</TableCell>
                    <TableCell>{r.categoria}</TableCell>
                    <TableCell>{r.genero}</TableCell>
                    <TableCell>{r.nombre}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono font-semibold text-neutral-900">
                      <span className="inline-flex items-center gap-1.5">
                        {r.tiempo}
                        {r.esRecordGeneral && (
                          <Crown className="h-3.5 w-3.5 text-yellow-500" aria-label="Record general" />
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-neutral-600">{r.ritmo}</TableCell>
                    <TableCell>{r.anio}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          <Crown className="mr-1 inline h-3 w-3 text-yellow-500" />
          Record general de la distancia (mejor tiempo absoluto por sexo).
        </p>
      </div>
    </section>
  )
}

export { RecordsQuinched }
