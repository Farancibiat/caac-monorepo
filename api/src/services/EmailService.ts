import { IEmailService, IEmailRepository, ServiceResult, ServiceResultHelper, SendContactMessageData } from '@/types';
import { 
  sendReservationConfirmation as sendReservationEmail, 
  sendReservationReminder as sendReminderEmail, 
  testConfiguration, 
  sendContactMessage as sendContactEmail 
} from '@/utils/email';

/**
 * Factory function para crear service de emails
 * Contiene lógica de negocio extraída de emailController
 */
export const createEmailService = (emailRepo: IEmailRepository): IEmailService => ({

  async sendReservationConfirmation(reservationId: number): Promise<ServiceResult<void>> {
    try {
      if (!reservationId) {
        return ServiceResultHelper.error('RESERVATION_ID_REQUIRED');
      }

      // Obtener datos de la reserva desde la base de datos
      const reservation = await emailRepo.findReservationById(reservationId);

      if (!reservation) {
        return ServiceResultHelper.error('RESERVATION_NOT_FOUND');
      }

      // Formatear datos para el email
      const reservationDetails = {
        id: reservation.id,
        date: reservation.date.toLocaleDateString('es-CL'),
        time: reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        service: 'Natación libre', // O el servicio específico
        duration: `${reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} - ${reservation.schedule.endTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`,
      };

      // Enviar email
      const emailSent = await sendReservationEmail(
        reservation.user.email!,
        reservationDetails
      );

      if (!emailSent) {
        return ServiceResultHelper.error('EMAIL_SEND_ERROR');
      }

      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('EMAIL_SEND_ERROR');
    }
  },

  async sendReservationReminder(reservationId: number): Promise<ServiceResult<void>> {
    try {
      if (!reservationId) {
        return ServiceResultHelper.error('RESERVATION_ID_REQUIRED');
      }

      // Obtener datos de la reserva
      const reservation = await emailRepo.findReservationById(reservationId);

      if (!reservation) {
        return ServiceResultHelper.error('RESERVATION_NOT_FOUND');
      }

      // Formatear datos para el recordatorio
      const reminderDetails = {
        id: reservation.id,
        date: reservation.date.toLocaleDateString('es-CL'),
        time: reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        service: 'Natación libre',
        duration: `${reservation.schedule.startTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} - ${reservation.schedule.endTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`,
      };

      // Enviar recordatorio
      const emailSent = await sendReminderEmail(
        reservation.user.email!,
        reminderDetails
      );

      if (!emailSent) {
        return ServiceResultHelper.error('EMAIL_SEND_ERROR');
      }

      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('EMAIL_SEND_ERROR');
    }
  },

  async testEmailConfiguration(): Promise<ServiceResult<void>> {
    try {
      const isConfigValid = await testConfiguration();

      if (!isConfigValid) {
        return ServiceResultHelper.error('EMAIL_CONFIG_INVALID');
      }

      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('EMAIL_CONFIG_ERROR');
    }
  },

  async sendContactMessage(contactData: SendContactMessageData): Promise<ServiceResult<void>> {
    try {
      // Validar datos básicos
      if (!contactData.nombre || !contactData.email || !contactData.asunto || !contactData.mensaje) {
        return ServiceResultHelper.error('CONTACT_INVALID_DATA');
      }

      // Enviar emails: confirmación al usuario y notificación al club
      const emailsSent = await sendContactEmail(contactData);

      if (!emailsSent) {
        return ServiceResultHelper.error('EMAIL_SEND_ERROR');
      }

      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('EMAIL_SEND_ERROR');
    }
  },

});

