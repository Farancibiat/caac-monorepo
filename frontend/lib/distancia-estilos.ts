// Estilos por distancia para tablas de resultados y records.
// 3,5 km → rojo · 1,3 km → verde · 0,5 km → amarillo · otras → neutro.

/** Orden de categorías de edad de MAYOR a MENOR (para ordenar todas las tablas). */
export const CATEGORIA_ORDEN = [
  '50 y más años',
  '40 a 49 años',
  '30 a 39 años',
  '19 a 29 años',
  'Hasta 29 años',
  'Menor de 18 años',
]

/** Índice de orden de una categoría (mayor→menor). Desconocidas al final. */
export const ordenCategoria = (c: string): number => {
  const i = CATEGORIA_ORDEN.indexOf(c)
  return i === -1 ? CATEGORIA_ORDEN.length : i
}

/** Clases para una fila de tabla: borde-izquierdo de acento + fondo tenue + hover. */
export const distanciaRowClass = (d: string): string => {
  switch (d) {
    case '3,5 km':
      return 'border-l-4 border-l-red-400 bg-red-50/60 hover:bg-red-100/60'
    case '1,3 km':
      return 'border-l-4 border-l-green-400 bg-green-50/60 hover:bg-green-100/60'
    case '0,5 km':
      return 'border-l-4 border-l-amber-400 bg-amber-50/70 hover:bg-amber-100/70'
    default:
      return 'border-l-4 border-l-neutral-200 hover:bg-neutral-50'
  }
}

export interface DistanciaAccent {
  /** Fondo + borde de la card */
  card: string
  /** Texto del título/distancia */
  texto: string
  /** Punto/badge de color */
  punto: string
}

/** Tokens de color para cards (records generales). */
export const distanciaAccent = (d: string): DistanciaAccent => {
  switch (d) {
    case '3,5 km':
      return { card: 'border-red-200 bg-red-50', texto: 'text-red-700', punto: 'bg-red-500' }
    case '1,3 km':
      return { card: 'border-green-200 bg-green-50', texto: 'text-green-700', punto: 'bg-green-500' }
    case '0,5 km':
      return { card: 'border-amber-200 bg-amber-50', texto: 'text-amber-700', punto: 'bg-amber-500' }
    default:
      return { card: 'border-neutral-200 bg-neutral-50', texto: 'text-neutral-700', punto: 'bg-neutral-400' }
  }
}
