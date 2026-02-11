import { ServiceResult } from '../common';

/**
 * Tipo para datos de mensaje de contacto
 */
export type SendContactMessageData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

/**
 * Contrato para service de emails
 */
export type IEmailService = {
  sendReservationConfirmation(reservationId: number): Promise<ServiceResult<void>>;
  sendReservationReminder(reservationId: number): Promise<ServiceResult<void>>;
  testEmailConfiguration(): Promise<ServiceResult<void>>;
  sendContactMessage(contactData: SendContactMessageData): Promise<ServiceResult<void>>;
};

