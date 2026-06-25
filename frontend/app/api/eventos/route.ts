import { NextResponse } from 'next/server'
import { CALENDARIO_EVENTOS } from '@/data/calendario-eventos'
import type { CalendarioEvento, TipoEvento } from '@/types/calendario-evento'

export const revalidate = 600 // 10 min

const CSV_URL = process.env.EVENTOS_CSV_URL ?? ''

// ─── CSV parser mínimo (RFC4180: comillas dobles, comas y saltos escapados) ───
function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((v) => v.trim() !== '')) rows.push(row)
      row = []
    } else {
      field += c
    }
  }
  // último campo/fila
  if (field !== '' || row.length) {
    row.push(field)
    if (row.some((v) => v.trim() !== '')) rows.push(row)
  }
  return rows
}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const normTipo = (raw: string): TipoEvento => {
  const s = norm(raw)
  if (s.includes('piscina')) return 'piscina'
  if (s.includes('triat')) return 'triathlon'
  return 'aguas-abiertas'
}

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// "2027-11-01" → "1 de noviembre, 2027"
const formatFecha = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const [, y, mo, d] = m
  const mes = MESES[parseInt(mo, 10) - 1]
  if (!mes) return iso
  return `${parseInt(d, 10)} de ${mes}, ${y}`
}

const slug = (s: string) =>
  norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function parseEventos(csv: string): CalendarioEvento[] {
  const rows = parseCSV(csv)
  if (rows.length < 2) return []

  const headers = rows[0].map(norm)
  const col = (...names: string[]) => headers.findIndex((h) => names.some((n) => h.includes(n)))
  const idx = {
    fecha: headers.findIndex((h) => h.includes('fecha') && !h.includes('display')),
    fechaDisplay: headers.findIndex((h) => h.includes('display')),
    nombre: col('nombre', 'evento'),
    ubicacion: col('ubicac', 'lugar'),
    tipo: col('tipo'),
    distancias: col('distanc'),
    web: col('inscrip', 'web', 'url'),
  }

  const eventos: CalendarioEvento[] = []
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i]
    const get = (j: number) => (j >= 0 ? (c[j] ?? '').trim() : '')
    const nombre = get(idx.nombre)
    if (!nombre) continue
    const fecha = get(idx.fecha)
    const fechaDisplay = get(idx.fechaDisplay) || (fecha ? formatFecha(fecha) : 'Por definir')
    const web = get(idx.web)
    eventos.push({
      id: slug(`${nombre}-${fecha || i}`),
      fecha: fecha || '9999-12-31', // sin fecha → al final al ordenar ascendente
      fechaDisplay,
      ubicacion: get(idx.ubicacion) || 'Por definir',
      nombre,
      tipo: normTipo(get(idx.tipo)),
      distancias: get(idx.distancias) || '—',
      webInscripciones: web || undefined,
    })
  }
  return eventos
}

export async function GET() {
  if (!CSV_URL) {
    return NextResponse.json({ eventos: CALENDARIO_EVENTOS })
  }
  try {
    const res = await fetch(CSV_URL, { next: { revalidate } })
    if (!res.ok) throw new Error(`CSV HTTP ${res.status}`)
    const csv = await res.text()
    const eventos = parseEventos(csv)
    if (eventos.length === 0) throw new Error('CSV sin eventos')
    return NextResponse.json(
      { eventos },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('[api/eventos] fallback a datos estáticos:', err)
    return NextResponse.json({ eventos: CALENDARIO_EVENTOS })
  }
}
