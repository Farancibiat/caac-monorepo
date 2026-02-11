import { SwimmingSchedule } from '@prisma/client';
import { ServiceResult } from '../common';
import { ScheduleAvailabilityQueryDTO, ScheduleAvailabilityResponseDTO } from '../dtos';

/**
 * Tipo para el service de horarios (Factory Function return type)
 * Define la lógica de negocio para horarios de natación
 */
export type IScheduleService = {
  // Consultas principales
  getAllSchedules(): Promise<ServiceResult<SwimmingSchedule[]>>;
  getScheduleById(id: number): Promise<ServiceResult<SwimmingSchedule>>;
  
  // Disponibilidad
  checkAvailability(query: ScheduleAvailabilityQueryDTO): Promise<ServiceResult<ScheduleAvailabilityResponseDTO>>;
  
  // Operaciones administrativas (para futuro)
  createSchedule(data: Partial<SwimmingSchedule>): Promise<ServiceResult<SwimmingSchedule>>;
  updateSchedule(id: number, data: Partial<SwimmingSchedule>): Promise<ServiceResult<SwimmingSchedule>>;
  deleteSchedule(id: number): Promise<ServiceResult<void>>;
};

