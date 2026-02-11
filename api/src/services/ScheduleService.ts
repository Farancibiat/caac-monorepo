import { SwimmingSchedule } from '@prisma/client';
import { 
  IScheduleService, 
  IScheduleRepository, 
  IReservationRepository,
  ServiceResult, 
  ServiceResultHelper,
  ScheduleAvailabilityQueryDTO, 
  ScheduleAvailabilityResponseDTO 
} from '@/types';

/**
 * Factory function para crear service de horarios
 * Contiene toda la lógica de negocio extraída de scheduleController
 */
export const createScheduleService = (
  scheduleRepo: IScheduleRepository,
  reservationRepo: IReservationRepository
): IScheduleService => ({

  async getAllSchedules(): Promise<ServiceResult<SwimmingSchedule[]>> {
    try {
      const schedules = await scheduleRepo.findActiveSchedules();
      return ServiceResultHelper.success(schedules);

    } catch (error) {
      return ServiceResultHelper.error('SCHEDULE_FETCH_ERROR');
    }
  },

  async getScheduleById(id: number): Promise<ServiceResult<SwimmingSchedule>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('SCHEDULE_INVALID_ID');
      }

      const schedule = await scheduleRepo.findById(id);
      
      if (!schedule) {
        return ServiceResultHelper.error('SCHEDULE_NOT_FOUND');
      }

      return ServiceResultHelper.success(schedule);

    } catch (error) {
      return ServiceResultHelper.error('SCHEDULE_FETCH_ERROR');
    }
  },

  async checkAvailability(query: ScheduleAvailabilityQueryDTO): Promise<ServiceResult<ScheduleAvailabilityResponseDTO>> {
    try {
      if (!query.scheduleId || !query.date) {
        return ServiceResultHelper.error('RESERVATION_MISSING_AVAILABILITY_DATA');
      }

      // 1. Obtener el horario
      const schedule = await scheduleRepo.findById(query.scheduleId);
      
      if (!schedule) {
        return ServiceResultHelper.error('SCHEDULE_NOT_FOUND');
      }

      // 2. Contar reservas existentes para ese horario y fecha
      const reservationDate = new Date(query.date);
      const reservationsCount = await reservationRepo.countByScheduleAndDate(
        query.scheduleId, 
        reservationDate
      );

      // 3. Calcular disponibilidad
      const availableSpots = Math.max(0, schedule.maxCapacity - reservationsCount);

      const availabilityData: ScheduleAvailabilityResponseDTO = {
        schedule: {
          id: schedule.id,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxCapacity: schedule.maxCapacity,
          laneCount: schedule.laneCount,
          isActive: schedule.isActive,
        },
        date: query.date,
        totalCapacity: schedule.maxCapacity,
        reservedSpots: reservationsCount,
        availableSpots,
        isFull: availableSpots === 0,
      };

      return ServiceResultHelper.success(availabilityData);

    } catch (error) {
      return ServiceResultHelper.error('SCHEDULE_AVAILABILITY_ERROR');
    }
  },

  async createSchedule(data: Partial<SwimmingSchedule>): Promise<ServiceResult<SwimmingSchedule>> {
    try {
      // Validar datos de entrada
      if (!data.dayOfWeek || !data.startTime || !data.endTime || !data.maxCapacity || !data.laneCount) {
        return ServiceResultHelper.error('SCHEDULE_MISSING_REQUIRED_FIELDS');
      }

      const newSchedule = await scheduleRepo.create(data);
      return ServiceResultHelper.success(newSchedule);

    } catch (error) {
      return ServiceResultHelper.error('SCHEDULE_CREATE_ERROR');
    }
  },

  async updateSchedule(id: number, data: Partial<SwimmingSchedule>): Promise<ServiceResult<SwimmingSchedule>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('SCHEDULE_INVALID_ID');
      }

      // Verificar que el horario existe
      const existingSchedule = await scheduleRepo.findById(id);
      if (!existingSchedule) {
        return ServiceResultHelper.error('SCHEDULE_NOT_FOUND');
      }

      const updatedSchedule = await scheduleRepo.update(id, data);
      return ServiceResultHelper.success(updatedSchedule);

    } catch (error) {
      return ServiceResultHelper.error('SCHEDULE_UPDATE_ERROR');
    }
  },

  async deleteSchedule(id: number): Promise<ServiceResult<void>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('SCHEDULE_INVALID_ID');
      }

      // Verificar que el horario existe
      const existingSchedule = await scheduleRepo.findById(id);
      if (!existingSchedule) {
        return ServiceResultHelper.error('SCHEDULE_NOT_FOUND');
      }

      // El repository maneja la lógica de soft delete vs hard delete
      await scheduleRepo.delete(id);
      
      return ServiceResultHelper.success(undefined);

    } catch (error) {
      return ServiceResultHelper.error('SCHEDULE_DELETE_ERROR');
    }
  }

});
