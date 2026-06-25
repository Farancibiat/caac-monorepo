import { NextResponse } from 'next/server'
import { parseCSV, normHeader } from '@/lib/csv'
import { construirResultados, type FilaCruda } from '@/lib/resultados-normalizar'
import { getResultadosPorDesafio } from '@/data/resultados'
import type { DesafioResultadosId, ResultadoDesafioFila } from '@/types/evento-historico'

export const revalidate = 600 // 10 min

const SHEET_ID = process.env.RESULTADOS_SHEET_ID ?? ''
// Años a leer (nombres de las hojas). Por defecto los que ya existen.
const ANIOS = (process.env.RESULTADOS_ANIOS ?? '2023,2024,2026')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const gvizUrl = (anio: string) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(anio)}`

// Fallback a los datos estáticos (JSON) para un año.
const estatico = (anio: string): ResultadoDesafioFila[] => {
  try {
    return getResultadosPorDesafio(anio as DesafioResultadosId)
  } catch {
    return []
  }
}

async function leerAnio(anio: string): Promise<ResultadoDesafioFila[]> {
  if (!SHEET_ID) return estatico(anio)
  try {
    const res = await fetch(gvizUrl(anio), { next: { revalidate } })
    if (!res.ok) throw new Error(`gviz HTTP ${res.status}`)
    const csv = await res.text()
    // Si la hoja no es accesible, Google devuelve HTML de login → no es CSV válido
    if (csv.trimStart().startsWith('<')) throw new Error('respuesta no-CSV (¿hoja no compartida?)')

    const rows = parseCSV(csv)
    if (rows.length < 2) return estatico(anio)

    const headers = rows[0].map(normHeader)
    const col = (...names: string[]) => headers.findIndex((h) => names.some((n) => h.includes(n)))
    const idx = {
      nombre: col('nombre', 'nadador'),
      genero: col('gener', 'sexo'),
      categoria: col('categor'),
      distancia: col('distan'),
      tiempo: col('tiempo', 'finish'),
    }
    if (idx.nombre < 0 || idx.tiempo < 0) return estatico(anio)

    const crudas: FilaCruda[] = rows.slice(1).map((c) => ({
      nombre: (c[idx.nombre] ?? '').trim(),
      genero: idx.genero >= 0 ? (c[idx.genero] ?? '').trim() : '',
      categoria: idx.categoria >= 0 ? (c[idx.categoria] ?? '').trim() : '',
      distancia: idx.distancia >= 0 ? (c[idx.distancia] ?? '').trim() : '',
      tiempo: (c[idx.tiempo] ?? '').trim(),
    }))
    const resultado = construirResultados(crudas)
    return resultado.length > 0 ? resultado : estatico(anio)
  } catch (err) {
    console.error(`[api/resultados] ${anio} → fallback estático:`, err)
    return estatico(anio)
  }
}

export async function GET() {
  const entradas = await Promise.all(ANIOS.map(async (a) => [a, await leerAnio(a)] as const))
  const resultados: Record<string, ResultadoDesafioFila[]> = {}
  for (const [anio, filas] of entradas) resultados[anio] = filas

  return NextResponse.json(
    { anios: ANIOS, resultados },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400' } }
  )
}
