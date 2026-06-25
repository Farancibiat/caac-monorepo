import { getResultadosPorDesafio } from '@/data/resultados'
import type { ResultadoDesafioFila } from '@/types/evento-historico'

const DISTANCIA_ORDER = ['Iniciación', '0,5 km', '1,3 km', '3,5 km']
// Género: Femenino antes que Masculino para agrupar visualmente
const GENERO_ORDER = ['Femenino', 'Masculino']

export interface RecordQuinched {
  distancia: string
  categoria: string
  genero: string
  nombre: string
  tiempo: string
  ritmo: string
  anio: number
  /** true si es el mejor tiempo absoluto de su (distancia, género) — record general */
  esRecordGeneral: boolean
}

interface EntradaConAnio extends ResultadoDesafioFila {
  anio: number
}

/**
 * Calcula los records. Recibe los resultados por año; si no se pasan, usa los
 * datos estáticos (fallback) de 2023/2024/2026.
 */
export function calcularRecordsQuinched(
  porAnio?: Record<string, ResultadoDesafioFila[]>
): RecordQuinched[] {
  const fuente: Record<string, ResultadoDesafioFila[]> =
    porAnio ?? {
      '2023': getResultadosPorDesafio('2023'),
      '2024': getResultadosPorDesafio('2024'),
      '2026': getResultadosPorDesafio('2026'),
    }

  const todos: EntradaConAnio[] = Object.entries(fuente).flatMap(([anio, filas]) =>
    filas.map((r) => ({ ...r, anio: Number(anio) }))
  )

  // Mejor por (distancia, categoria, genero)
  const records = new Map<string, EntradaConAnio>()
  // Mejor absoluto por (distancia, genero) → record general
  const generales = new Map<string, EntradaConAnio>()

  for (const entrada of todos) {
    const key = `${entrada.distancia}|${entrada.categoria}|${entrada.genero}`
    const current = records.get(key)
    if (!current || entrada.tiempoSegundos < current.tiempoSegundos) {
      records.set(key, entrada)
    }
    const keyGral = `${entrada.distancia}|${entrada.genero}`
    const curGral = generales.get(keyGral)
    if (!curGral || entrada.tiempoSegundos < curGral.tiempoSegundos) {
      generales.set(keyGral, entrada)
    }
  }

  return Array.from(records.values())
    .sort((a, b) => {
      // Orden: distancia descendente (3,5 → 0,5), luego por tiempo
      const dA = DISTANCIA_ORDER.indexOf(a.distancia)
      const dB = DISTANCIA_ORDER.indexOf(b.distancia)
      if (dA !== dB) return dB - dA
      return a.tiempoSegundos - b.tiempoSegundos
    })
    .map((e) => ({
      distancia: e.distancia,
      categoria: e.categoria,
      genero: e.genero,
      nombre: e.nombre,
      tiempo: e.tiempo,
      ritmo: e.ritmo,
      anio: e.anio,
      esRecordGeneral: generales.get(`${e.distancia}|${e.genero}`) === e,
    }))
}

/** Records generales (mejor absoluto por distancia y género), ordenados por distancia y género. */
export function recordsGenerales(records: RecordQuinched[]): RecordQuinched[] {
  return records
    .filter((r) => r.esRecordGeneral)
    .sort((a, b) => {
      const dA = DISTANCIA_ORDER.indexOf(a.distancia)
      const dB = DISTANCIA_ORDER.indexOf(b.distancia)
      if (dA !== dB) return dA - dB
      return GENERO_ORDER.indexOf(a.genero) - GENERO_ORDER.indexOf(b.genero)
    })
}
