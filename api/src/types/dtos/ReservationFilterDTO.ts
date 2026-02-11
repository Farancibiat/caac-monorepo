import { ReservationStatus } from '@prisma/client';

/**
 * DTO para filtrar reservas
 * Basado en los query parameters actuales de getAllReservations
 */
export interface ReservationFilterDTO {
  status?: ReservationStatus;
  date?: string; // ISO string format
  userId?: number;
  scheduleId?: number;
}

/**
 * DTO para obtener reservas del usuario actual
 */
export interface UserReservationFilterDTO {
  status?: ReservationStatus;
}

