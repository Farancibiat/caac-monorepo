import { Reservation, ReservationStatus, PrismaClient } from '@prisma/client';
import { IReservationRepository, CreateReservationInternalDTO, ReservationFilterDTO } from '@/types';

/**
 * Factory function para crear repository de reservas usando Prisma
 * Implementa acceso a datos sin lógica de negocio
 */
export const createReservationRepository = (prisma: PrismaClient): IReservationRepository => ({
  async findById(id: number): Promise<Reservation | null> {
    return await prisma.reservation.findUnique({
      where: { id }
    });
  },

  async findByFilter(filter: ReservationFilterDTO): Promise<Reservation[]> {
    const where: any = {};
    
    if (filter.status) {
      where.status = filter.status;
    }
    
    if (filter.date) {
      where.date = new Date(filter.date);
    }
    
    if (filter.userId) {
      where.userId = filter.userId;
    }

    if (filter.scheduleId) {
      where.scheduleId = filter.scheduleId;
    }
    
    return await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        schedule: true,
      },
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  },

  async findByUserAndDate(userId: number, scheduleId: number, date: Date): Promise<Reservation | null> {
    return await prisma.reservation.findFirst({
      where: {
        userId,
        scheduleId,
        date,
        status: {
          not: 'CANCELLED',
        },
      },
    });
  },

  async create(data: CreateReservationInternalDTO): Promise<Reservation> {
    return await prisma.reservation.create({
      data: {
        userId: data.userId,
        scheduleId: data.scheduleId,
        date: new Date(data.date),
        status: 'PENDING',
        isPaid: false,
        ...(data.notes && { notes: data.notes })
      },
      include: {
        schedule: true,
      },
    });
  },

  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return await prisma.reservation.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
    });
  },

  async countByScheduleAndDate(
    scheduleId: number, 
    date: Date, 
    excludeStatus: ReservationStatus = 'CANCELLED'
  ): Promise<number> {
    return await prisma.reservation.count({
      where: {
        scheduleId,
        date,
        status: {
          not: excludeStatus,
        },
      },
    });
  },

  async findUserReservations(userId: number, status?: ReservationStatus): Promise<Reservation[]> {
    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }
    
    return await prisma.reservation.findMany({
      where,
      include: {
        schedule: true,
      },
      orderBy: [
        { date: 'asc' },
      ],
    });
  },

  async findByIdWithRelations(id: number): Promise<Reservation | null> {
    return await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        schedule: true,
        paymentRecords: true,
      },
    });
  }
});