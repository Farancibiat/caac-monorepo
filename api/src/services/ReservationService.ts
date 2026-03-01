import { Reservation, PrismaClient } from '@prisma/client';
import { 
  IReservationService, 
  IReservationRepository, 
  IScheduleRepository,
  ServiceResult, 
  ServiceResultHelper,
  CreateReservationDTO, 
  CreateReservationInternalDTO,
  ReservationFilterDTO, 
  UserReservationFilterDTO 
} from '@/types';

/**
 * Factory function para crear service de reservas
 * Contiene toda la lógica de negocio extraída de reservationController
 */
export const createReservationService = (
  reservationRepo: IReservationRepository,
  scheduleRepo: IScheduleRepository,
  prisma: PrismaClient // Para operaciones transaccionales complejas
): IReservationService => ({

  async createReservation(userId: number, data: CreateReservationDTO): Promise<ServiceResult<Reservation>> {
    try {
      // 1. Verificar si el horario existe
      const schedule = await scheduleRepo.findById(data.scheduleId);
      if (!schedule) {
        return ServiceResultHelper.error('SCHEDULE_NOT_FOUND');
      }

      // 2. Verificar si el horario está activo
      if (!schedule.isActive) {
        return ServiceResultHelper.error('SCHEDULE_INACTIVE');
      }

      // 3. Verificar disponibilidad
      const reservationDate = new Date(data.date);
      const existingReservationsCount = await reservationRepo.countByScheduleAndDate(
        data.scheduleId, 
        reservationDate
      );

      if (existingReservationsCount >= schedule.maxCapacity) {
        return ServiceResultHelper.error('RESERVATION_NO_CAPACITY');
      }

      // 4. Verificar si el usuario ya tiene una reserva en ese horario y fecha
      const existingUserReservation = await reservationRepo.findByUserAndDate(
        userId, 
        data.scheduleId, 
        reservationDate
      );

      if (existingUserReservation) {
        return ServiceResultHelper.error('RESERVATION_ALREADY_EXISTS');
      }

      // 5. Crear la reserva
      const internalData: CreateReservationInternalDTO = {
        ...data,
        userId
      };

      const newReservation = await reservationRepo.create(internalData);
      
      return ServiceResultHelper.success(newReservation);

    } catch (error) {
      return ServiceResultHelper.error('RESERVATION_CREATE_ERROR');
    }
  },

  async cancelReservation(reservationId: number, userId: number, _reason?: string): Promise<ServiceResult<Reservation>> {
    try {
      // 1. Obtener la reserva con validación de permisos
      const reservation = await reservationRepo.findById(reservationId);
      
      if (!reservation) {
        return ServiceResultHelper.error('RESERVATION_NOT_FOUND');
      }

      // 2. Verificar permisos si es usuario normal
      if (reservation.userId !== userId) {
        return ServiceResultHelper.error('RESERVATION_INSUFFICIENT_PERMISSIONS');
      }

      // 3. No permitir cancelar una reserva ya completada
      if (reservation.status === 'COMPLETED') {
        return ServiceResultHelper.error('RESERVATION_CANNOT_CANCEL_COMPLETED');
      }

      // 4. Actualizar estado de la reserva
      const updatedReservation = await reservationRepo.updateStatus(reservationId, 'CANCELLED');
      
      return ServiceResultHelper.success(updatedReservation);

    } catch (error) {
      return ServiceResultHelper.error('RESERVATION_CANCEL_ERROR');
    }
  },

  async getReservationById(id: number, userId?: number): Promise<ServiceResult<Reservation>> {
    try {
      const reservation = await reservationRepo.findByIdWithRelations(id);
      
      if (!reservation) {
        return ServiceResultHelper.error('RESERVATION_NOT_FOUND');
      }

      // Si se proporciona userId, verificar permisos (usuario normal)
      if (userId !== undefined && reservation.userId !== userId) {
        return ServiceResultHelper.error('RESERVATION_INSUFFICIENT_PERMISSIONS');
      }

      return ServiceResultHelper.success(reservation);

    } catch (error) {
      return ServiceResultHelper.error('RESERVATION_FETCH_ERROR');
    }
  },

  async getUserReservations(userId: number, filter?: UserReservationFilterDTO): Promise<ServiceResult<Reservation[]>> {
    try {
      const reservations = await reservationRepo.findUserReservations(userId, filter?.status);
      return ServiceResultHelper.success(reservations);

    } catch (error) {
      return ServiceResultHelper.error('RESERVATION_FETCH_ERROR');
    }
  },

  async getAllReservations(filter?: ReservationFilterDTO): Promise<ServiceResult<Reservation[]>> {
    try {
      const reservations = await reservationRepo.findByFilter(filter || {});
      return ServiceResultHelper.success(reservations);

    } catch (error) {
      return ServiceResultHelper.error('RESERVATION_FETCH_ERROR');
    }
  },

  async confirmPayment(
    reservationId: number, 
    amount: number, 
    paymentMethod: string, 
    confirmedBy: number
  ): Promise<ServiceResult<void>> {
    try {
      // Usar transacción para operaciones atómicas
      await prisma.$transaction(async (tx) => {
        // 1. Verificar que la reserva existe y no está cancelada
        const reservation = await tx.reservation.findUnique({
          where: { id: reservationId }
        });

        if (!reservation) {
          throw new Error('RESERVATION_NOT_FOUND');
        }

        if (reservation.status === 'CANCELLED') {
          throw new Error('RESERVATION_CANNOT_CONFIRM_CANCELLED');
        }

        // 2. Crear registro de pago
        await tx.paymentRecord.create({
          data: {
            reservationId,
            amount,
            paymentMethod,
            confirmedById: confirmedBy,
          },
        });

        // 3. Actualizar reserva
        await tx.reservation.update({
          where: { id: reservationId },
          data: {
            isPaid: true,
            paymentDate: new Date(),
            paymentConfirmedBy: confirmedBy,
            status: 'CONFIRMED',
            updatedAt: new Date(),
          },
        });
      });

      return ServiceResultHelper.success();

    } catch (error: any) {
      const errorCode = error.message.startsWith('RESERVATION_') 
        ? error.message 
        : 'RESERVATION_PAYMENT_ERROR';
      return ServiceResultHelper.error(errorCode);
    }
  },

  async completeReservation(reservationId: number): Promise<ServiceResult<Reservation>> {
    try {
      // 1. Obtener la reserva
      const reservation = await reservationRepo.findById(reservationId);
      
      if (!reservation) {
        return ServiceResultHelper.error('RESERVATION_NOT_FOUND');
      }

      // 2. No permitir completar una reserva cancelada
      if (reservation.status === 'CANCELLED') {
        return ServiceResultHelper.error('RESERVATION_CANNOT_COMPLETE_CANCELLED');
      }

      // 3. Actualizar estado de la reserva
      const updatedReservation = await reservationRepo.updateStatus(reservationId, 'COMPLETED');
      
      return ServiceResultHelper.success(updatedReservation);

    } catch (error) {
      return ServiceResultHelper.error('RESERVATION_COMPLETE_ERROR');
    }
  }

});
