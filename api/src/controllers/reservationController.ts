import {  Response } from 'express';
import prisma from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';

// Obtener todas las reservas (admin/tesorero)
export const getAllReservations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, date, userId } = req.query;
    
    // Construir filtros
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      filter.date = new Date(date as string);
    }
    
    if (userId) {
      filter.userId = Number(userId);
    }
    
    const reservations = await prisma.reservation.findMany({
      where: filter,
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
    
    sendMessage(res, 'RESERVATION_LIST_RETRIEVED', reservations);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

// Obtener reservas del usuario actual
export const getUserReservations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    
    // Construir filtro
    const filter: any = {
      userId: parseInt(req.user.id),
    };
    
    if (status) {
      filter.status = status;
    }
    
    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        schedule: true,
      },
      orderBy: [
        { date: 'asc' },
      ],
    });
    
    sendMessage(res, 'RESERVATION_USER_LIST_RETRIEVED', reservations);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

// Obtener una reserva por ID
export const getReservationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
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
        paymentRecords: req.user.role === 'USER' ? false : true,
      },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // Si el usuario no es admin ni tesorero, verificar que la reserva sea del usuario
    if (req.user.role === 'USER' && reservation.userId !== parseInt(req.user.id)) {
      sendMessage(res, 'RESERVATION_INSUFFICIENT_PERMISSIONS');
      return;
    }
    
    sendMessage(res, 'RESERVATION_RETRIEVED', reservation);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

// Crear una nueva reserva
export const createReservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {

    const { scheduleId, date } = req.body;
    
    // Verificar si el horario existe
    const schedule = await prisma.swimmingSchedule.findUnique({
      where: { id: Number(scheduleId) },
    });
    
    if (!schedule) {
      sendMessage(res, 'SCHEDULE_NOT_FOUND');
      return;
    }
    
    // Verificar si el horario está activo
    if (!schedule.isActive) {
      sendMessage(res, 'SCHEDULE_INACTIVE');
      return;
    }
    
    // Verificar disponibilidad
    const reservationDate = new Date(date);
    const existingReservationsCount = await prisma.reservation.count({
      where: {
        scheduleId: Number(scheduleId),
        date: reservationDate,
        status: {
          not: 'CANCELLED',
        },
      },
    });
    
    if (existingReservationsCount >= schedule.maxCapacity) {
      sendMessage(res, 'RESERVATION_NO_CAPACITY');
      return;
    }
    
    // Verificar si el usuario ya tiene una reserva en ese horario y fecha
    const existingUserReservation = await prisma.reservation.findFirst({
      where: {
        userId: parseInt(req.user.id),
        scheduleId: Number(scheduleId),
        date: reservationDate,
        status: {
          not: 'CANCELLED',
        },
      },
    });
    
    if (existingUserReservation) {
      sendMessage(res, 'RESERVATION_ALREADY_EXISTS');
      return;
    }
    
    // Crear la reserva
    const newReservation = await prisma.reservation.create({
      data: {
        userId: parseInt(req.user.id),
        scheduleId: Number(scheduleId),
        date: reservationDate,
        status: 'PENDING',
        isPaid: false,
      },
      include: {
        schedule: true,
      },
    });
    
    sendMessage(res, 'RESERVATION_CREATED', newReservation);
  } catch (error) {
    sendMessage(res, 'RESERVATION_CREATE_ERROR');
  }
};

// Cancelar una reserva (usuario, admin)
export const cancelReservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // Verificar permisos
    if (req.user.role === 'USER' && reservation.userId !== parseInt(req.user.id)) {
      sendMessage(res, 'RESERVATION_CANCEL_INSUFFICIENT_PERMISSIONS');
      return;
    }
    
    // No permitir cancelar una reserva ya completada
    if (reservation.status === 'COMPLETED') {
      sendMessage(res, 'RESERVATION_CANNOT_CANCEL_COMPLETED');
      return;
    }
    
    // Actualizar estado de la reserva
    const updatedReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });
    
    sendMessage(res, 'RESERVATION_CANCELLED', updatedReservation);
  } catch (error) {
    sendMessage(res, 'RESERVATION_CANCEL_ERROR');
  }
};

// Confirmar pago de una reserva (admin/tesorero)
export const confirmPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;
    
    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // No permitir confirmar pago de una reserva cancelada
    if (reservation.status === 'CANCELLED') {
      sendMessage(res, 'RESERVATION_CANNOT_CONFIRM_CANCELLED');
      return;
    }
    
    // Crear registro de pago
    await prisma.paymentRecord.create({
      data: {
        reservationId: Number(id),
        amount: Number(amount),
        paymentMethod,
        confirmedById: parseInt(req.user.id),
      },
    });
    
    // Actualizar reserva
    await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        isPaid: true,
        paymentDate: new Date(),
        paymentConfirmedBy: parseInt(req.user.id),
        status: 'CONFIRMED',
        updatedAt: new Date(),
      },
    });
    
    sendMessage(res, 'RESERVATION_PAYMENT_CONFIRMED');
  } catch (error) {
    sendMessage(res, 'RESERVATION_PAYMENT_ERROR');
  }
};

// Marcar reserva como completada (admin)
export const completeReservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // No permitir completar una reserva cancelada
    if (reservation.status === 'CANCELLED') {
      sendMessage(res, 'RESERVATION_CANNOT_COMPLETE_CANCELLED');
      return;
    }
    
    // Actualizar estado de la reserva
    await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });
    
    sendMessage(res, 'RESERVATION_COMPLETED');
  } catch (error) {
    sendMessage(res, 'RESERVATION_COMPLETE_ERROR');
  }
}; 