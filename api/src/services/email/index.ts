export { 
  sendEmail,
  sendReservationConfirmation,
  sendReservationReminder,
  sendContactMessage,
  testConfiguration
} from './emailService';
export type { EmailTemplate } from './emailService';
export { processTemplate } from './templateProcessor'; 