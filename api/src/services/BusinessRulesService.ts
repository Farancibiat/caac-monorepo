import { IBusinessRulesService, ValidationResult, ValidationResultHelper } from '@/types';


/**
 * Factory function para crear service de reglas de negocio
 * Contiene validaciones específicas del dominio de reservas
 */
export const createBusinessRulesService = (): IBusinessRulesService => ({

  validateReservationTime(date: string): ValidationResult {
    try {
      const reservationDate = new Date(date);
      const today = new Date();
      
      // Regla: No se puede reservar el mismo día después de las 20:00
      const isSameDay = reservationDate.toDateString() === today.toDateString();
      const currentHour = today.getHours();
      
      if (isSameDay && currentHour >= 20) {
        return ValidationResultHelper.singleError(
          'date', 
          'No se puede reservar el mismo día después de las 20:00',
          'RESERVATION_CUTOFF_TIME_EXCEEDED'
        );
      }

      // Regla: No se puede reservar en fechas pasadas
      if (reservationDate < today) {
        return ValidationResultHelper.singleError(
          'date',
          'No se puede reservar en fechas pasadas',
          'RESERVATION_PAST_DATE'
        );
      }

      return ValidationResultHelper.valid();

    } catch (error) {
      return ValidationResultHelper.singleError(
        'date',
        'Fecha de reserva inválida',
        'RESERVATION_INVALID_DATE'
      );
    }
  },

  validateUserReservationLimit(currentReservations: number): ValidationResult {
    const MAX_ACTIVE_RESERVATIONS = 3;

    if (currentReservations >= MAX_ACTIVE_RESERVATIONS) {
      return ValidationResultHelper.singleError(
        'userId',
        `Máximo ${MAX_ACTIVE_RESERVATIONS} reservas activas permitidas`,
        'RESERVATION_LIMIT_EXCEEDED'
      );
    }

    return ValidationResultHelper.valid();
  },

  validateCancellationTime(reservationDate: Date): ValidationResult {
    const now = new Date();
    const timeDiff = reservationDate.getTime() - now.getTime();
    const hoursUntilReservation = timeDiff / (1000 * 60 * 60);

    // Regla: Mínimo 2 horas antes para cancelar
    const MIN_CANCELLATION_HOURS = 2;

    if (hoursUntilReservation < MIN_CANCELLATION_HOURS) {
      return ValidationResultHelper.singleError(
        'reservationDate',
        `Debe cancelar con al menos ${MIN_CANCELLATION_HOURS} horas de anticipación`,
        'RESERVATION_CANCELLATION_TOO_LATE'
      );
    }

    return ValidationResultHelper.valid();
  }

});

