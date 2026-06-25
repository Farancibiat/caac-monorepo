import type { ResultadoDesafioFila } from '@/types/evento-historico'

// Construye ResultadoDesafioFila[] a partir de filas crudas (nombre, genero, categoria,
// distancia, tiempo) calculando tiempoSegundos, ritmo (min/100m) y posiciones.
// Posición general = ranking por tiempo dentro de (distancia + género).
// Posición categoría = ranking por tiempo dentro de (distancia + categoría + género).

export interface FilaCruda {
  nombre: string
  genero: string
  categoria: string
  distancia: string
  tiempo: string
}

const norm = (s: string) =>
  String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const DORDER = ['Iniciación', '0,5 km', '1,3 km', '3,5 km']

const normGenero = (raw: string): string => {
  const s = norm(raw)
  if (s.startsWith('f')) return 'Femenino'
  if (s.startsWith('m')) return 'Masculino'
  return raw.trim()
}

const normDistancia = (raw: string): string => {
  const s = norm(raw)
  if (s.includes('inici')) return 'Iniciación'
  const n = parseInt(s.replace(/[^\d]/g, ''), 10)
  if (n === 500 || s === '0,5 km' || s.includes('0,5') || s.includes('0.5')) return '0,5 km'
  if (n === 1300 || n === 1000 || n === 1500 || s.includes('1,3') || s.includes('1.3')) return '1,3 km'
  if (n === 3500 || s.includes('3,5') || s.includes('3.5')) return '3,5 km'
  return raw.trim()
}

const normCategoria = (raw: string): string => {
  const s = norm(raw)
  if (s.includes('menor de 18') || s.includes('menos de 18') || s.includes('menos 18'))
    return 'Menor de 18 años'
  if (s.includes('50') && (s.includes('mas') || s.includes('>'))) return '50 y más años'
  if (s.includes('<29') || s.includes('hasta 29') || s.includes('menor de 29')) return 'Hasta 29 años'
  const m = s.match(/(\d{2})\s*[-a]+\s*(\d{2})/)
  if (m) return `${m[1]} a ${m[2]} años`
  return raw.trim()
}

// "hh:mm:ss" | "h:mm:ss" | "mm:ss" → segundos
const parseTiempoSegundos = (raw: string): number => {
  const p = String(raw).trim().split(':').map((x) => parseFloat(x))
  if (p.some(Number.isNaN)) return 0
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2]
  if (p.length === 2) return p[0] * 60 + p[1]
  return 0
}

const DIST_METROS: Record<string, number> = {
  'Iniciación': 100,
  '0,5 km': 500,
  '1,3 km': 1300,
  '3,5 km': 3500,
}

const fmtRitmo = (totalSec: number, metros: number): string => {
  if (!metros) return ''
  const secPer100 = totalSec / (metros / 100)
  const mm = Math.floor(secPer100 / 60)
  const ss = Math.round(secPer100 - mm * 60)
  return `${mm}:${String(ss).padStart(2, '0')}`
}

export function construirResultados(filas: FilaCruda[]): ResultadoDesafioFila[] {
  const rows: ResultadoDesafioFila[] = filas
    .filter((f) => (f.nombre ?? '').trim() && (f.tiempo ?? '').trim())
    .map((f) => {
      const distancia = normDistancia(f.distancia)
      const tiempoSegundos = parseTiempoSegundos(f.tiempo)
      return {
        nombre: f.nombre.trim(),
        genero: normGenero(f.genero),
        categoria: normCategoria(f.categoria),
        distancia,
        tiempo: f.tiempo.trim(),
        tiempoSegundos,
        posGeneral: 0,
        posCategoria: 0,
        ritmo: fmtRitmo(tiempoSegundos, DIST_METROS[distancia] ?? 0),
      }
    })
    .filter((r) => r.tiempoSegundos > 0)

  const rank = (keyFn: (r: ResultadoDesafioFila) => string, field: 'posGeneral' | 'posCategoria') => {
    const groups = new Map<string, ResultadoDesafioFila[]>()
    for (const r of rows) {
      const k = keyFn(r)
      if (!groups.has(k)) groups.set(k, [])
      groups.get(k)!.push(r)
    }
    for (const arr of groups.values()) {
      arr.sort((a, b) => a.tiempoSegundos - b.tiempoSegundos).forEach((r, i) => {
        r[field] = i + 1
      })
    }
  }
  rank((r) => `${r.distancia}|${r.genero}`, 'posGeneral')
  rank((r) => `${r.distancia}|${r.categoria}|${r.genero}`, 'posCategoria')

  rows.sort(
    (a, b) =>
      DORDER.indexOf(a.distancia) - DORDER.indexOf(b.distancia) || a.tiempoSegundos - b.tiempoSegundos
  )
  return rows
}
