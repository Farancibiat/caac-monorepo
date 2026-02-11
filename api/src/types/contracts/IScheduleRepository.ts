import { SwimmingSchedule } from '@prisma/client';

/**
 * Tipo para el repository de horarios (Factory Function return type)
 * Define las operaciones de acceso a datos para horarios de natación
 */
export type IScheduleRepository = {
  // Consultas básicas
  findById(id: number): Promise<SwimmingSchedule | null>;
  findAll(): Promise<SwimmingSchedule[]>;
  findActiveSchedules(): Promise<SwimmingSchedule[]>;
  
  // Operaciones CRUD básicas (para futuro uso en admin)
  create(data: Partial<SwimmingSchedule>): Promise<SwimmingSchedule>;
  update(id: number, data: Partial<SwimmingSchedule>): Promise<SwimmingSchedule>;
  delete(id: number): Promise<void>;
  
  // Consultas específicas del dominio
  findByDayOfWeek(dayOfWeek: number): Promise<SwimmingSchedule[]>;
};
