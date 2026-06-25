export type TipoEvento = 'piscina' | 'aguas-abiertas' | 'triathlon'

export interface CalendarioEvento {
  id: string
  fecha: string
  fechaDisplay: string
  ubicacion: string
  nombre: string
  tipo: TipoEvento
  distancias: string
  webInscripciones?: string
}

export const TIPO_EVENTO_LABEL: Record<TipoEvento, string> = {
  'piscina': 'Piscina',
  'aguas-abiertas': 'Aguas Abiertas',
  'triathlon': 'Triatlón',
}
