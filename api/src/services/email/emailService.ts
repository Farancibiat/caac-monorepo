import { Resend } from 'resend';
import { processTemplate } from './templateProcessor';
import type { SendContactMessageData } from '../../schemas/contact';

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@web.aguasabiertaschiloe.cl';
const SITE_NAME = process.env.SITE_NAME || 'Club de Aguas Abiertas Chiloé';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contacto@aguasabiertaschiloe.cl';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Envía un email usando un template HTML con datos dinámicos
 * 
 * @param templateName - Nombre del archivo template (sin extensión .html)
 * @param to - Dirección de email del destinatario
 * @param subject - Asunto del email
 * @param data - Datos para reemplazar en el template
 * @param options - Opciones adicionales para el email (cc, bcc, from)
 * @returns Promise<boolean> - true si el email se envió correctamente, false en caso de error
 * 
 * @example
 * ```typescript
 * await sendEmail('contactMessage', 'user@example.com', 'Nuevo contacto', {
 *   nombre: 'Juan Pérez',
 *   mensaje: 'Hola, me interesa información...'
 * }, {
 *   cc: ['admin@example.com'],
 *   bcc: ['backup@example.com']
 * });
 * ```
 */
export const sendEmail = async (
  templateName: string, 
  to: string, 
  subject: string, 
  data: Record<string, any>,
  options?: {
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
  }
): Promise<boolean> => {
  try {
    const html = processTemplate(templateName, data);
    
    const emailParams: any = {
      from: options?.from || DEFAULT_FROM,
      to,
      subject,
      html,
    };

    // Agregar cc si está especificado
    if (options?.cc) {
      emailParams.cc = options.cc;
    }

    // Agregar bcc si está especificado
    if (options?.bcc) {
      emailParams.bcc = options.bcc;
    }

    const { error } = await resend.emails.send(emailParams);

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


export const sendContactMessage = async (contactData: SendContactMessageData): Promise<boolean> => {
  const emailData = {
    ...contactData,
    fecha: new Date().toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  try {
    // 1. Enviar email de confirmación al usuario
    const userEmailSent = await sendEmail(
      'contactConfirmation',
      contactData.email,
      `Gracias por tu mensaje: ${contactData.asunto} - ${SITE_NAME}`,
      emailData
    );

    // 2. Enviar notificación al club
    const clubEmailSent = await sendEmail(
      'contactMessage',
      CONTACT_EMAIL,
      `Nuevo mensaje de contacto: ${contactData.asunto}`,
      emailData
    );

    // Retornar true solo si ambos emails se enviaron correctamente
    return userEmailSent && clubEmailSent;
  } catch (error) {
    console.error('Error sending contact messages:', error);
    return false;
  }
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