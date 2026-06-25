import type { CalendarioEvento } from '@/types/calendario-evento'

export const CALENDARIO_EVENTOS: CalendarioEvento[] = [
  {
    id: 'clinica-02-2026',
    fecha: '2026-04-04',
    fechaDisplay: '4 de Abril, 2026',
    ubicacion: 'Laguna Millán, Chiloé',
    nombre: '2° Clínica de Aguas Abiertas',
    tipo: 'aguas-abiertas',
    distancias: 'Iniciación',
  },
  {
    id: 'desafio-03-2026',
    fecha: '2026-04-05',
    fechaDisplay: '5 de Abril, 2026',
    ubicacion: 'Quinched, Chiloé',
    nombre: '3° Desafío Unión de las Islas',
    tipo: 'aguas-abiertas',
    distancias: 'Iniciación | 0,5 km | 1 km | 3,5 km',
    webInscripciones: 'https://forms.gle/1xFDjzwXk46AKHxu6',
  },
  {
    id: 'feria-02-2026',
    fecha: '2026-04-05',
    fechaDisplay: '5 de Abril, 2026',
    ubicacion: 'Quinched, Chiloé',
    nombre: '2° Feria de Aguas Abiertas',
    tipo: 'aguas-abiertas',
    distancias: 'Evento recreativo (sin distancia competitiva)',
  },
  {
    id: 'desafio-04-2027',
    fecha: '2027-11-01',
    fechaDisplay: 'Noviembre, 2027',
    ubicacion: 'Quinched, Chiloé',
    nombre: '4° Desafío Unión de las Islas',
    tipo: 'aguas-abiertas',
    distancias: 'Por definir',
  },
]
