'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth/store'
import { useRouting } from '@/hooks/useRouting'
import RedirectMsj from '@/components/RedirectMsj'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { getReservationContext, postReservationRelease, postReservationBatch } from '@/lib/reservations-api'
import type { ReservationContextData, ReservationContextDay } from '@/types/api-responses/reservation-context'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function toMonthYear(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function toDateString(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

/** Solo Lunes(1), Miércoles(3), Viernes(5) tienen sesión */
function isPoolDay(dayOfWeek: number): boolean {
  return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5
}

export default function ReservasPage() {
  const { user, loading: authLoading } = useAuthStore()
  const { redirect, routes } = useRouting()
  const [monthYear, setMonthYear] = useState(() => toMonthYear(new Date()))
  const [context, setContext] = useState<ReservationContextData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [releaseMode, setReleaseMode] = useState(false)
  const [selectedReservationIds, setSelectedReservationIds] = useState<number[]>([])
  const [releaseModalOpen, setReleaseModalOpen] = useState(false)
  const [releaseSubmitting, setReleaseSubmitting] = useState(false)
  const [newReservationModalOpen, setNewReservationModalOpen] = useState(false)
  const [newReservationSubmitting, setNewReservationSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const refetchContext = useCallback(() => {
    if (!monthYear) return
    getReservationContext(monthYear)
      .then((res) => {
        if (res.ok && res.data) setContext(res.data)
      })
      .catch(() => {})
  }, [monthYear])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError(null)
    getReservationContext(monthYear)
      .then((res) => {
        if (res.ok && res.data) setContext(res.data)
        else setError(res.error ?? 'Error al cargar reservas')
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setLoading(false))
  }, [user, monthYear])

  useEffect(() => {
    if (!authLoading && !user) redirect(routes.AUTH.LOGIN)
  }, [authLoading, user, redirect, routes.AUTH.LOGIN])

  const calendarByDate = useMemo(() => {
    const map = new Map<string, ReservationContextDay>()
    if (context?.calendar) {
      for (const day of context.calendar) map.set(day.date, day)
    }
    return map
  }, [context?.calendar])

  const { year, month } = useMemo(() => {
    const [y, m] = monthYear.split('-').map(Number)
    return { year: y ?? new Date().getFullYear(), month: (m ?? new Date().getMonth() + 1) - 1 }
  }, [monthYear])

  const monthLabel = MONTH_NAMES[month] + ' ' + year
  const todayStr = toDateString(new Date())

  const goPrev = () => {
    const d = new Date(year, month - 1, 1)
    setMonthYear(toMonthYear(d))
  }
  const goNext = () => {
    const d = new Date(year, month + 1, 1)
    setMonthYear(toMonthYear(d))
  }

  const toggleReleaseMode = () => {
    setReleaseMode((prev) => !prev)
    if (releaseMode) setSelectedReservationIds([])
  }

  const onToggleReservation = useCallback((reservationId: number, checked: boolean) => {
    setSelectedReservationIds((prev) =>
      checked ? [...prev, reservationId] : prev.filter((id) => id !== reservationId)
    )
  }, [])

  const openReleaseModal = () => {
    if (selectedReservationIds.length > 0) setReleaseModalOpen(true)
  }

  const confirmRelease = async () => {
    if (selectedReservationIds.length === 0) return
    setReleaseSubmitting(true)
    setError(null)
    const res = await postReservationRelease(selectedReservationIds)
    setReleaseSubmitting(false)
    if (res.ok) {
      setReleaseModalOpen(false)
      setReleaseMode(false)
      setSelectedReservationIds([])
      setSuccessMessage('Cupos liberados correctamente.')
      refetchContext()
    } else {
      setError(res.error ?? 'Error al liberar cupos')
    }
  }

  const openNewReservationModal = () => {
    if (context?.canReserveNextMonth) setNewReservationModalOpen(true)
  }

  const confirmNewReservation = async () => {
    if (!context?.nextMonthAvailableDates?.length) return
    setNewReservationSubmitting(true)
    setError(null)
    const res = await postReservationBatch(context.nextMonthAvailableDates)
    setNewReservationSubmitting(false)
    if (res.ok) {
      setNewReservationModalOpen(false)
      setSuccessMessage('Reserva creada. Revisa tu correo para el detalle.')
      refetchContext()
    } else {
      setError(res.error ?? 'Error al crear la reserva')
    }
  }

  const reservationIdToDate = useMemo(() => {
    const map = new Map<number, string>()
    context?.calendar?.forEach((day) => {
      if (day.reservationId != null) map.set(day.reservationId, day.date)
    })
    return map
  }, [context?.calendar])

  if (authLoading) {
    return (
      <RedirectMsj message="Verificando autenticación" location="reservas" variant="loading" />
    )
  }
  if (!user) {
    return (
      <RedirectMsj message="Debes iniciar sesión para ver reservas" location="login" variant="warning" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-800">Reservas</h1>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={goPrev} aria-label="Mes anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[200px] text-center">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={goNext} aria-label="Mes siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {releaseMode ? (
            <>
              <Button onClick={openReleaseModal} disabled={selectedReservationIds.length === 0}>
                Confirmar liberaciones ({selectedReservationIds.length})
              </Button>
              <Button variant="outline" onClick={toggleReleaseMode}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={toggleReleaseMode}>
                Liberar cupos
              </Button>
              <Button
                variant="outline"
                disabled={!context?.canReserveNextMonth}
                onClick={openNewReservationModal}
              >
                Nueva reserva
              </Button>
            </>
          )}
        </div>

        {successMessage && (
          <p className="text-sm text-green-700 bg-green-50 p-2 rounded">{successMessage}</p>
        )}

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : context ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendario del mes</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthGrid
                  year={year}
                  month={month}
                  calendarByDate={calendarByDate}
                  todayStr={todayStr}
                  releaseMode={releaseMode}
                  selectedReservationIds={selectedReservationIds}
                  onToggleReservation={onToggleReservation}
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-green-500" aria-hidden />
                Reservado
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-muted border" aria-hidden />
                Sin reserva
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-red-500" aria-hidden />
                Cancelado
              </span>
            </div>

            {context.pendingRefunds > 0 && (
              <p className="text-sm text-amber-700">
                Tienes reembolsos pendientes por aplicar: ${context.pendingRefunds.toLocaleString('es-CL')}
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              Para solicitudes especiales o dudas, contacta al club por correo o WhatsApp.
            </p>
          </>
        ) : null}

        <Dialog open={releaseModalOpen} onOpenChange={setReleaseModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar liberación de cupos</DialogTitle>
              <DialogDescription>
                Se liberarán {selectedReservationIds.length} cupo(s). Las fechas afectadas quedarán disponibles para otros.
              </DialogDescription>
            </DialogHeader>
            <ul className="text-sm list-disc list-inside max-h-40 overflow-y-auto">
              {selectedReservationIds.map((id) => (
                <li key={id}>{reservationIdToDate.get(id) ?? `Reserva #${id}`}</li>
              ))}
            </ul>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReleaseModalOpen(false)} disabled={releaseSubmitting}>
                Cancelar
              </Button>
              <Button onClick={confirmRelease} disabled={releaseSubmitting}>
                {releaseSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Liberando…
                  </>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={newReservationModalOpen} onOpenChange={setNewReservationModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva reserva</DialogTitle>
              <DialogDescription>
                Reservarás el mes siguiente ({context?.nextMonthAvailableDates?.length ?? 0} sesiones).
                {context?.pricing && (
                  <span className="block mt-2">
                    Total estimado: $
                    {(
                      (context.nextMonthAvailableDates?.length ?? 0) * context.pricing.pricePerSession -
                      context.pendingRefunds
                    ).toLocaleString('es-CL')}{' '}
                    ({context.pricing.isSocio ? 'socio' : 'no socio'}: ${context.pricing.pricePerSession.toLocaleString('es-CL')}/sesión)
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Al confirmar se enviará un correo con el detalle. Realiza la transferencia según las instrucciones.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewReservationModalOpen(false)} disabled={newReservationSubmitting}>
                Cancelar
              </Button>
              <Button onClick={confirmNewReservation} disabled={newReservationSubmitting}>
                {newReservationSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando reserva…
                  </>
                ) : (
                  'Confirmar reserva'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

interface MonthGridProps {
  year: number
  month: number
  calendarByDate: Map<string, ReservationContextDay>
  todayStr: string
  releaseMode?: boolean
  selectedReservationIds?: number[]
  onToggleReservation?: (reservationId: number, checked: boolean) => void
}

function MonthGrid({
  year,
  month,
  calendarByDate,
  todayStr,
  releaseMode = false,
  selectedReservationIds = [],
  onToggleReservation,
}: MonthGridProps) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const totalDays = last.getDate()
  const startWeekday = first.getDay()

  const rows: { date: Date | null; dateStr: string | null; dayOfWeek: number }[] = []
  for (let i = 0; i < startWeekday; i++) rows.push({ date: null, dateStr: null, dayOfWeek: i })
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day)
    rows.push({ date: d, dateStr: toDateString(d), dayOfWeek: d.getDay() })
  }
  const rest = 7 - (rows.length % 7)
  if (rest < 7) for (let i = 0; i < rest; i++) rows.push({ date: null, dateStr: null, dayOfWeek: -1 })

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {weekDays.map((label) => (
        <div key={label} className="text-xs font-medium text-muted-foreground py-1">
          {label}
        </div>
      ))}
      {rows.map((cell, idx) => {
        if (!cell.dateStr) {
          return <div key={`empty-${idx}`} className="aspect-square" />
        }
        const dayInfo = calendarByDate.get(cell.dateStr)
        const isPool = isPoolDay(cell.dayOfWeek)
        const isFuture = cell.dateStr >= todayStr
        const canRelease = releaseMode && isPool && dayInfo?.status === 'RESERVED' && dayInfo.reservationId != null && isFuture
        let bg = 'bg-muted/50'
        if (isPool && dayInfo) {
          if (dayInfo.status === 'RESERVED') bg = 'bg-green-500 text-white'
          else if (dayInfo.status === 'CANCELLED') bg = 'bg-red-500 text-white'
        } else if (isPool) {
          bg = 'bg-background border'
        }
        const content = (
          <>
            {canRelease && onToggleReservation && dayInfo?.reservationId != null && (
              <Checkbox
                checked={selectedReservationIds.includes(dayInfo.reservationId)}
                onCheckedChange={(checked) =>
                  onToggleReservation(dayInfo.reservationId!, checked === true)
                }
                onClick={(e) => e.stopPropagation()}
                className="absolute top-0.5 left-0.5 bg-white border-gray-300"
                aria-label={`Liberar ${cell.dateStr}`}
              />
            )}
            <span>{cell.date?.getDate() ?? ''}</span>
          </>
        )
        return (
          <div
            key={cell.dateStr}
            className={`aspect-square flex items-center justify-center rounded text-sm relative ${bg}`}
            title={dayInfo ? `Estado: ${dayInfo.status ?? 'sin reserva'}` : undefined}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}
