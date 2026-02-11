/**
 * DTO para crear una reserva
 * Basado en el schema existente de reservationSchemas.create
 */
export interface CreateReservationDTO {
  scheduleId: number;
  date: string; // ISO string format
  notes?: string;
}

/**
 * DTO interno con datos adicionales del usuario autenticado
 */
export interface CreateReservationInternalDTO extends CreateReservationDTO {
  userId: number; // Agregado desde req.user.id
}

