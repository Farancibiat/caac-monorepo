/**
 * DTO para consultar disponibilidad de horarios
 * Basado en el endpoint checkAvailability actual
 */
export interface ScheduleAvailabilityQueryDTO {
  scheduleId: number;
  date: string; // ISO string format
}

/**
 * DTO para respuesta de disponibilidad
 * Basado en la respuesta actual de checkAvailability
 */
export interface ScheduleAvailabilityResponseDTO {
  schedule: {
    id: number;
    dayOfWeek: number;
    startTime: Date;
    endTime: Date;
    maxCapacity: number;
    laneCount: number;
    isActive: boolean;
  };
  date: string;
  totalCapacity: number;
  reservedSpots: number;
  availableSpots: number;
  isFull: boolean;
}

