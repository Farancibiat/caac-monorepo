import { ValidationResult } from '../common';

/**
 * Tipo para el service de reglas de negocio
 */
export type IBusinessRulesService = {
  validateReservationTime(date: string): ValidationResult;
  validateUserReservationLimit(userId: number, currentReservations: number): ValidationResult;
  validateCancellationTime(reservationDate: Date): ValidationResult;
};