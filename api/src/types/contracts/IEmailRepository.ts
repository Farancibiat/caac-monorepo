import { Reservation, User, SwimmingSchedule } from '@prisma/client';

/**
 * Tipo para datos de reserva completos para emails
 */
export type ReservationEmailData = Reservation & {
  user: Pick<User, 'email' | 'name'>;
  schedule: Pick<SwimmingSchedule, 'startTime' | 'endTime' | 'dayOfWeek'>;
};

/**
 * Contrato para repositorio de emails
 */
export type IEmailRepository = {
  findReservationById(reservationId: number): Promise<ReservationEmailData | null>;
};

