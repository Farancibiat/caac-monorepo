import { Response, Request } from 'express';
import { sendReservationConfirmation as sendReservationEmail, sendReservationReminder as sendReminderEmail, testConfiguration, sendContactMessage as sendContactEmail } from '@/services/email';
import { sendMessage } from '@/utils/responseHelper';
import prisma from '@/config/db';
import { AuthenticatedRequest } from '@/config/auth';
import { SendContactMessageData } from '@/schemas/contact';

// Enviar comprobante de reserva
export const sendReservationConfirmation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
    const emailSent = await sendReservationEmail(
      reservation.user.email!,
      reservationDetails
    );

    if (!emailSent) {
      sendMessage(res, 'EMAIL_SEND_ERROR');
      return;
    }

    sendMessage(res, 'RESERVATION_EMAIL_SENT');
  } catch (error) {
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};

// Enviar recordatorio de reserva
export const sendReservationReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
    const emailSent = await sendReminderEmail(
      reservation.user.email!,
      reservationDetails
    );

    if (!emailSent) {
      sendMessage(res, 'EMAIL_SEND_ERROR');
      return;
    }

    sendMessage(res, 'REMINDER_EMAIL_SENT');
  } catch (error) {
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};

// Endpoint para probar la configuración de emails
export const testEmailConfiguration = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const isConfigured = await testConfiguration();
    
    if (isConfigured) {
      sendMessage(res, 'EMAIL_CONFIG_VALID');
    } else {
      sendMessage(res, 'EMAIL_CONFIG_INVALID');
    }
  } catch (error) {
    sendMessage(res, 'EMAIL_CONFIG_ERROR');
  }
};

// Enviar mensaje de contacto (endpoint público)
export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData: SendContactMessageData = req.body;

    // Enviar email al equipo del club
    const emailSent = await sendContactEmail(contactData);

    if (!emailSent) {
      sendMessage(res, 'EMAIL_SEND_ERROR');
      return;
    }

    sendMessage(res, 'CONTACT_MESSAGE_SENT');
  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
}; 