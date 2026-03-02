/** Respuesta de GET /api/reservations/context?monthYear=YYYY-MM */
export interface ReservationContextDay {
  date: string;
  dayOfWeek: number;
  status: 'RESERVED' | 'CANCELLED' | null;
  reservationId?: number;
}

export interface ReservationContextSchedule {
  id: number;
  dayOfWeek: number;
  label: string;
}

export interface ReservationContextData {
  monthYear: string;
  calendar: ReservationContextDay[];
  canReserveNextMonth: boolean;
  nextMonthAvailableDates: string[];
  pricing: {
    isSocio: boolean;
    pricePerSession: number;
  };
  pendingRefunds: number;
  schedules: ReservationContextSchedule[];
}
