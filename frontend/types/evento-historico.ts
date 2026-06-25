export type DesafioResultadosId = '2023' | '2024' | '2026'

export interface ResultadoDesafioFila {
  nombre: string
  genero: string
  categoria: string
  distancia: string
  tiempo: string
  tiempoSegundos: number
  /** Posición general dentro de la distancia */
  posGeneral: number
  /** Posición dentro de categoría + género + distancia */
  posCategoria: number
  /** Ritmo en min/100m, ej "2:13" */
  ritmo: string
}
