import { Reservation } from '@prisma/client';
import { ServiceResult } from '../common';
import { CreateReservationDTO, ReservationFilterDTO, UserReservationFilterDTO } from '../dtos';

/**
 * Tipo para el service de reservas (Factory Function return type)
 * Define la lógica de negocio para reservas
 */
export type IReservationService = {
  // Operaciones principales
  createReservation(userId: number, data: CreateReservationDTO): Promise<ServiceResult<Reservation>>;
  cancelReservation(reservationId: number, userId: number, reason?: string): Promise<ServiceResult<Reservation>>;
  
  // Consultas
  getReservationById(id: number, userId?: number): Promise<ServiceResult<Reservation>>;
  getUserReservations(userId: number, filter?: UserReservationFilterDTO): Promise<ServiceResult<Reservation[]>>;
  getAllReservations(filter?: ReservationFilterDTO): Promise<ServiceResult<Reservation[]>>;
  
  // Operaciones administrativas
  confirmPayment(reservationId: number, amount: number, paymentMethod: string, confirmedBy: number): Promise<ServiceResult<void>>;
  completeReservation(reservationId: number): Promise<ServiceResult<Reservation>>;
};

