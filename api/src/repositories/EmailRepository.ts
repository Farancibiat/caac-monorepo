import { PrismaClient } from '@prisma/client';
import { IEmailRepository, ReservationEmailData } from '@/types';

/**
 * Repository para operaciones de email
 * Factory Function que encapsula acceso a datos para emails
 */
export const createEmailRepository = (prisma: PrismaClient): IEmailRepository => ({

  async findReservationById(reservationId: number): Promise<ReservationEmailData | null> {
    return await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        schedule: {
          select: {
            startTime: true,
            endTime: true,
            dayOfWeek: true,
          },
        },
      },
    });
  },

});

