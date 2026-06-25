import type { DesafioResultadosId, ResultadoDesafioFila } from '@/types/evento-historico'
import r2023 from './2023.json'
import r2024 from './2024.json'
import r2026 from './2026.json'

// Datos generados con scripts/convert-resultados.mjs a partir de los Excel oficiales.
const RESULTADOS: Record<DesafioResultadosId, ResultadoDesafioFila[]> = {
  '2023': r2023 as ResultadoDesafioFila[],
  '2024': r2024 as ResultadoDesafioFila[],
  '2026': r2026 as ResultadoDesafioFila[],
}

export const getResultadosPorDesafio = (id: DesafioResultadosId): ResultadoDesafioFila[] =>
  RESULTADOS[id] ?? []

/** IDs de desafíos que ya tienen resultados cargados (no vacíos). */
export const desafiosConResultados = (Object.keys(RESULTADOS) as DesafioResultadosId[]).filter(
  (id) => RESULTADOS[id].length > 0
)
