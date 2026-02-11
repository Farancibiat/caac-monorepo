import { Reservation, ReservationStatus } from '@prisma/client';
import { CreateReservationInternalDTO, ReservationFilterDTO } from '../dtos';

/**
 * Tipo para el repository de reservas (Factory Function return type)
 * Define las operaciones de acceso a datos sin lógica de negocio
 */
export type IReservationRepository = {
  // Consultas básicas
  findById(id: number): Promise<Reservation | null>;
  findByFilter(filter: ReservationFilterDTO): Promise<Reservation[]>;
  findByUserAndDate(userId: number, scheduleId: number, date: Date): Promise<Reservation | null>;
  
  // Operaciones CRUD
  create(data: CreateReservationInternalDTO): Promise<Reservation>;
  updateStatus(id: number, status: ReservationStatus): Promise<Reservation>;
  
  // Consultas específicas del dominio
  countByScheduleAndDate(scheduleId: number, date: Date, excludeStatus?: ReservationStatus): Promise<number>;
  findUserReservations(userId: number, status?: ReservationStatus): Promise<Reservation[]>;
  
  // Incluir relaciones cuando sea necesario
  findByIdWithRelations(id: number): Promise<Reservation | null>;
};
