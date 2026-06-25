'use client'

import { useEffect, useMemo, useState } from 'react'
import { YearTabs } from '@/components/ui/YearTabs'
import { ResultadosDesafioTable } from '@/components/eventos/ResultadosDesafioTable'
import { getResultadosPorDesafio, desafiosConResultados } from '@/data/resultados'
import type { ResultadoDesafioFila } from '@/types/evento-historico'

// Fallback estático (datos JSON) si la planilla no está disponible.
const FALLBACK: { anios: string[]; resultados: Record<string, ResultadoDesafioFila[]> } = {
  anios: [...desafiosConResultados],
  resultados: Object.fromEntries(desafiosConResultados.map((a) => [a, getResultadosPorDesafio(a)])),
}

const ResultadosPorAnio = () => {
  const [anio, setAnio] = useState<string | null>(null)
  const [fuente, setFuente] = useState(FALLBACK)

  useEffect(() => {
    let activo = true
    fetch('/api/resultados')
      .then((r) => r.json())
      .then((data: { anios?: string[]; resultados?: Record<string, ResultadoDesafioFila[]> }) => {
        if (activo && data.anios?.length && data.resultados) {
          setFuente({ anios: data.anios, resultados: data.resultados })
        }
      })
      .catch(() => {/* se mantiene el fallback */})
    return () => {
      activo = false
    }
  }, [])

  const tabs = useMemo(() => fuente.anios.map((a) => ({ key: a, label: a })), [fuente])
  const data = anio ? fuente.resultados[anio] ?? [] : []

  return (
    <YearTabs
      tabs={tabs}
      activeKey={anio}
      onSelect={(key) => setAnio(key)}
      accent="gold"
      invitation="Selecciona un año para ver los resultados de esa edición del Desafío Quinched."
    >
      {anio &&
        (data.length > 0 ? (
          <ResultadosDesafioTable data={data} />
        ) : (
          <p className="py-10 text-center text-neutral-500">
            Resultados de {anio} aún no disponibles. Se publicarán próximamente.
          </p>
        ))}
    </YearTabs>
  )
}

export { ResultadosPorAnio }
