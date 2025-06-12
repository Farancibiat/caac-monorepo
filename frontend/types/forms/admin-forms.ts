// Formulario para crear/editar club
export interface ClubFormData {
  nombre: string;
  isActive?: boolean;
}

// Formulario para crear/editar horario
export interface ScheduleFormData {
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  maxCapacity: number;
  laneCount: number;
  isActive?: boolean;
}

// Formulario para crear usuario (admin)
export interface CreateUserFormData {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ADMIN' | 'TREASURER';
} 