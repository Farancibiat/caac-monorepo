'use client'

import { useState } from 'react'
import { YearTabs } from '@/components/ui/YearTabs'
import { ResultadosDesafioTable } from '@/components/eventos/ResultadosDesafioTable'
import { getResultadosPorDesafio } from '@/data/resultados'
import type { DesafioResultadosId } from '@/types/evento-historico'

const ANIOS: DesafioResultadosId[] = ['2023', '2024', '2026']

const ResultadosPorAnio = () => {
  const [anio, setAnio] = useState<string | null>(null)

  const tabs = ANIOS.map((a) => ({ key: a, label: a }))
  const data = anio ? getResultadosPorDesafio(anio as DesafioResultadosId) : []

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
