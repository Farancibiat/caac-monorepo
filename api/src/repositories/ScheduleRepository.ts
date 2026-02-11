import { SwimmingSchedule, PrismaClient } from '@prisma/client';
import { IScheduleRepository } from '@/types';

/**
 * Factory function para crear repository de horarios usando Prisma
 * Implementa acceso a datos sin lógica de negocio
 */
export const createScheduleRepository = (prisma: PrismaClient): IScheduleRepository => ({
  async findById(id: number): Promise<SwimmingSchedule | null> {
    return await prisma.swimmingSchedule.findUnique({
      where: { id }
    });
  },

  async findAll(): Promise<SwimmingSchedule[]> {
    return await prisma.swimmingSchedule.findMany({
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  },

  async findActiveSchedules(): Promise<SwimmingSchedule[]> {
    return await prisma.swimmingSchedule.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  },

  async create(data: Partial<SwimmingSchedule>): Promise<SwimmingSchedule> {
    return await prisma.swimmingSchedule.create({
      data: {
        dayOfWeek: data.dayOfWeek!,
        startTime: data.startTime!,
        endTime: data.endTime!,
        maxCapacity: data.maxCapacity!,
        laneCount: data.laneCount!,
        isActive: data.isActive ?? true,
      },
    });
  },

  async update(id: number, data: Partial<SwimmingSchedule>): Promise<SwimmingSchedule> {
    const updateData: any = {};
    
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.startTime) updateData.startTime = data.startTime;
    if (data.endTime) updateData.endTime = data.endTime;
    if (data.maxCapacity !== undefined) updateData.maxCapacity = data.maxCapacity;
    if (data.laneCount !== undefined) updateData.laneCount = data.laneCount;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    
    return await prisma.swimmingSchedule.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: number): Promise<void> {
    // Verificar si hay reservas asociadas
    const reservationsCount = await prisma.reservation.count({
      where: { scheduleId: id },
    });
    
    if (reservationsCount > 0) {
      // Si hay reservas, solo marcar como inactivo
      await prisma.swimmingSchedule.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      // Si no hay reservas, eliminar completamente
      await prisma.swimmingSchedule.delete({
        where: { id },
      });
    }
  },

  async findByDayOfWeek(dayOfWeek: number): Promise<SwimmingSchedule[]> {
    return await prisma.swimmingSchedule.findMany({
      where: { 
        dayOfWeek,
        isActive: true
      },
      orderBy: { startTime: 'asc' },
    });
  }
});