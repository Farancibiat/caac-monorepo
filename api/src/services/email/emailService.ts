import { Resend } from 'resend';
import { processTemplate } from './templateProcessor';

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@web.aguasabiertaschiloe.cl';
const SITE_NAME = process.env.SITE_NAME || 'Club de Aguas Abiertas Chiloé';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Envía un email usando un template HTML con datos dinámicos
 * 
 * @param templateName - Nombre del archivo template (sin extensión .html)
 * @param to - Dirección de email del destinatario
 * @param subject - Asunto del email
 * @param data - Datos para reemplazar en el template
 * @returns Promise<boolean> - true si el email se envió correctamente, false en caso de error
 * 
 * @example
 * ```typescript
 * await sendEmail('contactMessage', 'user@example.com', 'Nuevo contacto', {
 *   nombre: 'Juan Pérez',
 *   mensaje: 'Hola, me interesa información...'
 * });
 * ```
 */
export const sendEmail = async (
  templateName: string, 
  to: string, 
  subject: string, 
  data: Record<string, any>
): Promise<boolean> => {
  try {
    const html = processTemplate(templateName, data);
    
    const { error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return false;
  }
};

export const sendReservationConfirmation = async (to: string, reservationDetails: any): Promise<boolean> => {
  return sendEmail(
    'reservationConfirmation',
    to,
    `Comprobante de reserva #${reservationDetails.id} - ${SITE_NAME}`,
    {
      ...reservationDetails,
      fecha: new Date().toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  );
};


 
export const sendReservationReminder = async (to: string, reservationDetails: any): Promise<boolean> => {
  return sendEmail(
    'reservationReminder',
    to,
    `Recordatorio: Tu reserva es mañana - ${SITE_NAME}`,
    reservationDetails
  );
};


export const sendContactMessage = async (contactData: any): Promise<boolean> => {
  return sendEmail(
    'contactMessage',
    contactData.email,
    `Nuevo mensaje de contacto: ${contactData.asunto}`,
    {
      ...contactData,
      fecha: new Date().toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  );
};

/**
 * Verifica que la configuración de Resend esté correcta
 * 
 * @returns Promise<boolean> - true si la configuración es válida
 * 
 * @example
 * ```typescript
 * const isConfigured = await testConfiguration();
 * if (!isConfigured) {
 *   throw new Error('Email service not properly configured');
 * }
 * ```
 */
export const testConfiguration = async (): Promise<boolean> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error testing email configuration:', error);
    return false;
  }
};

export default sendEmail; 