// Conversor de resultados de desafíos: TSV (export de Excel) → JSON normalizado.
//
// Uso:
//   node scripts/convert-resultados.mjs <archivo.tsv> <año>
//
// El archivo debe estar separado por TABS. Detecta automáticamente dos formatos:
//   A) Columnas separadas: Apellido Paterno / Materno / Nombres / Género / Categoría /
//      Distancia / Tiempo (mm:ss:cc). Sin posiciones → se calculan.
//   B) Timing por chip: Corredor (nombre completo) / Categoría ("Categoría N: edad Género") /
//      Finish (hh:mm:ss.ms) / Pos.Cat / Pos.Gral / Ritmo (min/Km). Sin distancia → se deriva
//      de finish/ritmo.
// Normaliza distancia, categoría y género; calcula ritmo en min/100m; filtra DNS (tiempo 0).
// Escribe frontend/data/resultados/<año>.json

import { readFileSync, writeFileSync } from 'fs'

const [, , inPath, year] = process.argv
if (!inPath || !year) {
  console.error('Uso: node scripts/convert-resultados.mjs <archivo.tsv> <año>')
  process.exit(1)
}

const norm = (s) =>
  String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// Title Case: primera letra en mayúscula y resto en minúscula en cada palabra
// (partículas como "de", "del", "la" quedan en minúscula salvo al inicio).
const PARTICULAS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'da'])
const fixCase = (name) =>
  String(name)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && PARTICULAS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')

const normGenero = (raw) => {
  const s = norm(raw)
  if (s.startsWith('f')) return 'Femenino'
  if (s.startsWith('m')) return 'Masculino'
  return raw.trim()
}

// Etiquetas canónicas de categoría (alinea las que coinciden entre ediciones)
const normCategoria = (raw) => {
  const s = norm(raw)
  if (s.includes('menor de 18') || s.includes('menos de 18') || s.includes('menos 18'))
    return 'Menor de 18 años'
  if (s.includes('50') && (s.includes('mas') || s.includes('>'))) return '50 y más años'
  if (s.includes('<29') || s.includes('≤29') || s.includes('menor de 29')) return 'Hasta 29 años'
  // Rangos tipo "30-39", "30 a 39", "19-29"
  const m = s.match(/(\d{2})\s*[-a]+\s*(\d{2})/)
  if (m) return `${m[1]} a ${m[2]} años`
  return raw.trim()
}

const KNOWN_KM = [0.1, 0.5, 1, 1.3, 1.5, 3.5]
const labelDistancia = (km) => {
  const nearest = KNOWN_KM.reduce((a, b) => (Math.abs(b - km) < Math.abs(a - km) ? b : a))
  if (nearest === 0.1) return 'Iniciación'
  if (nearest === 0.5) return '0,5 km'
  // Corrección de datos: 1 km (2023) y 1,5 km (2026) fueron errores → la distancia real era 1,3 km
  if (nearest === 1 || nearest === 1.3 || nearest === 1.5) return '1,3 km'
  if (nearest === 3.5) return '3,5 km'
  return `${km} km`
}
const normDistanciaMetros = (raw) => {
  const n = parseInt(String(raw).replace(/\D/g, ''), 10)
  return labelDistancia(n / 1000)
}
const distanciaMetros = (label) =>
  ({ 'Iniciación': 100, '0,5 km': 500, '1 km': 1000, '1,3 km': 1300, '1,5 km': 1500, '3,5 km': 3500 }[
    label
  ] ?? 0)

// "mm:ss:cc" (formato A) → segundos
const parseTimeA = (raw) => {
  const p = String(raw).trim().split(':').map((x) => parseInt(x, 10))
  if (p.some(Number.isNaN) || p.length < 2) return null
  const [mm, ss, cc = 0] = p
  const seconds = mm * 60 + ss + cc / 100
  return seconds === 0 ? null : Math.round(seconds * 100) / 100
}
// "hh:mm:ss.ms" (formato B) → segundos
const parseTimeB = (raw) => {
  const p = String(raw).trim().split(':')
  if (p.length !== 3) return null
  const hh = parseInt(p[0], 10)
  const mm = parseInt(p[1], 10)
  const ss = parseFloat(p[2])
  if ([hh, mm, ss].some(Number.isNaN)) return null
  const seconds = hh * 3600 + mm * 60 + ss
  return seconds === 0 ? null : Math.round(seconds * 100) / 100
}
// "mm:ss" o "h:mm:ss" (formato JSON) → segundos
const parseTimeJSON = (raw) => {
  const p = String(raw).trim().split(':').map(Number)
  if (p.some(Number.isNaN)) return null
  let sec
  if (p.length === 2) sec = p[0] * 60 + p[1]
  else if (p.length === 3) sec = p[0] * 3600 + p[1] * 60 + p[2]
  else return null
  return sec === 0 ? null : Math.round(sec * 100) / 100
}

const fmtTiempo = (totalSec) => {
  const s = Math.round(totalSec)
  const hh = Math.floor(s / 3600)
  const mm = Math.floor((s % 3600) / 60)
  const ss = s % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

// Ritmo en min/100m a partir de tiempo total y distancia
const fmtRitmo = (totalSec, metros) => {
  if (!metros) return ''
  const secPer100 = totalSec / (metros / 100)
  const mm = Math.floor(secPer100 / 60)
  const ss = Math.round(secPer100 - mm * 60)
  return `${mm}:${String(ss).padStart(2, '0')}`
}

const ritmoMinPerKm = (raw) => {
  const m = String(raw).match(/(\d+):(\d+)/)
  if (!m) return null
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60
}

// ─── Lectura ──────────────────────────────────────────────────────────────────
const isJson = inPath.toLowerCase().endsWith('.json')
let rows = []
let descartadas = 0
let formatLabel = ''

if (isJson) {
  // Formato JSON: campos pos_gral/pos_cat/nadador/genero/categoria/distancia/tiempo/ritmo_100m
  formatLabel = 'JSON'
  const arr = JSON.parse(readFileSync(inPath, 'utf8'))
  for (const it of arr) {
    const seconds = parseTimeJSON(it.tiempo ?? it.finish)
    if (seconds === null) { descartadas++; continue }
    const distancia = normDistanciaMetros(it.distancia)
    rows.push({
      nombre: fixCase(it.nadador ?? it.nombre ?? ''),
      genero: normGenero(it.genero),
      categoria: normCategoria(it.categoria),
      distancia,
      tiempo: fmtTiempo(seconds),
      tiempoSegundos: seconds,
      posGeneral: 0, // se recalcula abajo (por distancia + género)
      posCategoria: 0,
      ritmo: fmtRitmo(seconds, distanciaMetros(distancia)),
    })
  }
} else {
const lines = readFileSync(inPath, 'utf8').split(/\r?\n/).filter((l) => l.trim())
if (lines.length < 2) {
  console.error('El archivo no tiene filas de datos.')
  process.exit(1)
}
const header = lines[0].split('\t').map(norm)
const find = (...kws) => header.findIndex((h) => kws.some((k) => h.includes(k)))
const formatB = header.some((h) => h.includes('corredor') || h.includes('finish'))
formatLabel = formatB ? 'chip' : 'columnas'

if (formatB) {
  const idx = {
    corredor: find('corredor', 'nombre'),
    cat: find('categor'),
    finish: find('finish', 'tiempo'),
    posCat: find('pos.cat', 'pos cat', 'poscat'),
    posGral: find('pos.gral', 'pos gral', 'posgral', 'general'),
    ritmo: find('ritmo'),
  }
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split('\t')
    const seconds = parseTimeB(c[idx.finish])
    if (seconds === null) { descartadas++; continue }
    const catRaw = c[idx.cat] ?? ''
    const genero = /femenino/i.test(catRaw) ? 'Femenino' : /masculino/i.test(catRaw) ? 'Masculino' : ''
    // quitar prefijo "Categoría N:" y el género del final
    const catLimpia = catRaw.replace(/categor[ií]a\s*\d*\s*:?/i, '').replace(/(masculino|femenino)/i, '').trim()
    const rpk = ritmoMinPerKm(c[idx.ritmo])
    const km = rpk ? seconds / 60 / rpk : 0
    const distancia = labelDistancia(km)
    rows.push({
      nombre: fixCase(c[idx.corredor] ?? ''),
      genero,
      categoria: normCategoria(catLimpia),
      distancia,
      tiempo: fmtTiempo(seconds),
      tiempoSegundos: seconds,
      posGeneral: 0, // se recalcula abajo (por distancia + género)
      posCategoria: 0,
      ritmo: fmtRitmo(seconds, distanciaMetros(distancia)),
    })
  }
} else {
  const idx = {
    ap: find('paterno'), am: find('materno'), nom: find('nombre'),
    gen: find('gener', 'sexo'), cat: find('categor'),
    dist: find('distan'), time: find('tiempo'),
  }
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split('\t')
    const seconds = parseTimeA(c[idx.time])
    if (seconds === null) { descartadas++; continue }
    const nombre = [c[idx.nom], c[idx.ap], c[idx.am]].map((x) => (x ?? '').trim()).filter(Boolean).join(' ')
    const distancia = normDistanciaMetros(c[idx.dist])
    rows.push({
      nombre: fixCase(nombre),
      genero: normGenero(c[idx.gen]),
      categoria: normCategoria(c[idx.cat]),
      distancia,
      tiempo: fmtTiempo(seconds),
      tiempoSegundos: seconds,
      posGeneral: 0, // se recalcula abajo
      posCategoria: 0,
      ritmo: fmtRitmo(seconds, distanciaMetros(distancia)),
    })
  }
}
}

// Correcciones de categoría por nombre (errores de origen), por año.
const OVERRIDE_CATEGORIA = {
  '2024': [
    { match: 'bannister flano', categoria: 'Menor de 18 años' }, // Felipe Bannister Flaño
    { match: 'cespedes orias', categoria: 'Menor de 18 años' }, // Benjamín Céspedes Orias
    { match: 'gonzalez subiabre', categoria: 'Menor de 18 años' }, // Javier Ignacio González Subiabre
    { match: 'jara carcamo', categoria: 'Menor de 18 años' }, // Alondra Ignacia Jara Cárcamo
  ],
}
const overrides = OVERRIDE_CATEGORIA[year]
if (overrides) {
  for (const r of rows) {
    const n = norm(r.nombre)
    const hit = overrides.find((o) => n.includes(o.match))
    if (hit) r.categoria = hit.categoria
  }
}

// Posiciones (recalculadas de forma uniforme para todos los formatos):
// - General: ranking por tiempo dentro de (distancia + género)  → cada distancia tiene podio F y M
// - Categoría: ranking por tiempo dentro de (distancia + categoría + género)
const rank = (keyFn, field) => {
  const groups = new Map()
  for (const r of rows) {
    const k = keyFn(r)
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k).push(r)
  }
  for (const arr of groups.values()) {
    arr.sort((a, b) => a.tiempoSegundos - b.tiempoSegundos).forEach((r, i) => { r[field] = i + 1 })
  }
}
rank((r) => `${r.distancia}|${r.genero}`, 'posGeneral')
rank((r) => `${r.distancia}|${r.categoria}|${r.genero}`, 'posCategoria')

// Orden de salida: distancia → tiempo
const DORDER = ['Iniciación', '0,5 km', '1,3 km', '3,5 km']
rows.sort(
  (a, b) =>
    DORDER.indexOf(a.distancia) - DORDER.indexOf(b.distancia) || a.tiempoSegundos - b.tiempoSegundos
)

const out = `frontend/data/resultados/${year}.json`
writeFileSync(out, JSON.stringify(rows, null, 2) + '\n')
console.log(`OK (formato ${formatLabel}): ${rows.length} filas en ${out} (${descartadas} DNS descartadas)`)
