import type { User } from '@/types/models/user';
import type { SwimmingSchedule } from '@/types/models/schedule';

// Estados de reserva
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// Reserva base
export interface Reservation {
  id: number;
  userId: number;
  scheduleId: number;
  date: string; // ISO string
  status: ReservationStatus;
  isPaid: boolean;
  amount?: number | null;
  paymentMethod?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Reserva con datos relacionados (para listas)
export interface ReservationWithRelations extends Reservation {
  user: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  schedule: SwimmingSchedule;
}

// Registro de pago
export interface PaymentRecord {
  id: number;
  reservationId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Reserva completa con pagos
export interface ReservationWithPayments extends ReservationWithRelations {
  paymentRecords: PaymentRecord[];
} 