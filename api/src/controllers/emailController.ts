import { Response, Request } from 'express';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { getEmailService } from '@/config/container';

/**
 * CONTROLADOR DE EMAILS - Patrón CSR
 * 
 * Cambios principales:
 * - Eliminado acceso directo a Prisma y utils/email
 * - Toda la lógica movida a EmailService
 * - Solo HTTP handling
 * - Consistente con arquitectura CSR
 */

// Enviar comprobante de reserva
export const sendReservationConfirmation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reservationId } = req.body;
    const emailService = getEmailService();

    const result = await emailService.sendReservationConfirmation(reservationId);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
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
    const emailService = getEmailService();

    const result = await emailService.sendReservationReminder(reservationId);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'REMINDER_EMAIL_SENT');
  } catch (error) {
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};

// Probar configuración de email
export const testEmailConfiguration = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const emailService = getEmailService();

    const result = await emailService.testEmailConfiguration();

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EMAIL_CONFIG_VALID');
  } catch (error) {
    sendMessage(res, 'EMAIL_CONFIG_ERROR');
  }
};

// Enviar mensaje de contacto (endpoint público)
export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData = req.body;
    const emailService = getEmailService();

    const result = await emailService.sendContactMessage(contactData);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'CONTACT_MESSAGE_SENT');
  } catch (error) {
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};