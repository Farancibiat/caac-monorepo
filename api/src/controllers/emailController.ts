import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';
import { sendMessage } from '../utils/responseHelper';
import prisma from '../config/db';

// Enviar comprobante de reserva
export const sendReservationConfirmation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      sendMessage(res, 'RESERVATION_ID_REQUIRED');
      return;
    }

    // Obtener datos de la reserva desde la base de datos
    const reservation = await prisma.reservation.findUnique({
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

    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }

    // Formatear datos para el email
    const reservationDetails = {
      id: reservation.id,
      date: reservation.date.toLocaleDateString('es-CL'),
      time: reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      service: 'Natación libre', // O el servicio específico
      duration: `${reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} - ${reservation.schedule.endTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`,
      cost: 'Por confirmar', // Se puede agregar campo de precio después
    };

    // Enviar email
    const emailSent = await EmailService.sendReservationConfirmation(
      reservation.user.email!,
      reservationDetails
    );

    if (!emailSent) {
      sendMessage(res, 'EMAIL_SEND_ERROR');
      return;
    }

    sendMessage(res, 'RESERVATION_EMAIL_SENT');
  } catch (error) {
    console.error('Error enviando comprobante de reserva:', error);
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};

// Enviar recordatorio de reserva
export const sendReservationReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      sendMessage(res, 'RESERVATION_ID_REQUIRED');
      return;
    }

    // Obtener datos de la reserva
    const reservation = await prisma.reservation.findUnique({
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
            dayOfWeek: true,
          },
        },
      },
    });

    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }

    // Formatear datos para el recordatorio
    const reservationDetails = {
      id: reservation.id,
      date: reservation.date.toLocaleDateString('es-CL'),
      time: reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      service: 'Natación libre',
    };

    // Enviar recordatorio
    const emailSent = await EmailService.sendReservationReminder(
      reservation.user.email!,
      reservationDetails
    );

    if (!emailSent) {
      sendMessage(res, 'EMAIL_SEND_ERROR');
      return;
    }

    sendMessage(res, 'REMINDER_EMAIL_SENT');
  } catch (error) {
    console.error('Error enviando recordatorio:', error);
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};

// Endpoint para probar la configuración de emails
export const testEmailConfiguration = async (_req: Request, res: Response): Promise<void> => {
  try {
    const isConfigured = await EmailService.testConfiguration();
    
    if (isConfigured) {
      sendMessage(res, 'EMAIL_CONFIG_VALID');
    } else {
      sendMessage(res, 'EMAIL_CONFIG_INVALID');
    }
  } catch (error) {
    console.error('Error testando configuración de email:', error);
    sendMessage(res, 'EMAIL_CONFIG_ERROR');
  }
}; 