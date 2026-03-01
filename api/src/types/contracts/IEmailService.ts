import { ServiceResult } from '../common';

/**
 * Tipo para datos de mensaje de contacto (debe coincidir con schemas/contact)
 */
export type SendContactMessageData = {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
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

