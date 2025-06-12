// Detalles de reserva para emails
export interface ReservationEmailDetails {
  id: number;
  date: string;
  time: string;
  service: string;
  duration?: string;
  cost?: string;
}

// Detalles para recordatorio de reserva
export type ReservationReminderDetails = Omit<ReservationEmailDetails, 'duration' | 'cost' >;

