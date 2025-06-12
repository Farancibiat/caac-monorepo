// Horario de piscina
export interface SwimmingSchedule {
  id: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, etc.
  startTime: string; // ISO string
  endTime: string; // ISO string
  maxCapacity: number;
  laneCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Disponibilidad de un horario
export interface ScheduleAvailability {
  schedule: SwimmingSchedule;
  date: string;
  totalCapacity: number;
  reservedSpots: number;
  availableSpots: number;
  isFull: boolean;
} 