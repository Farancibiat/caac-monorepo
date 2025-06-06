import { Resend } from 'resend';

// Inicializar Resend con API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración por defecto
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
const SITE_NAME = process.env.SITE_NAME || 'Club de Aguas Abiertas Chiloé';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// Tipos de emails
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Templates de correos transaccionales
export class EmailTemplates {
  
  // Email de comprobante de reserva
  static reservationConfirmation(to: string, reservation: any): EmailTemplate {
    return {
      to,
      subject: `Comprobante de reserva #${reservation.id} - ${SITE_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Comprobante de Reserva</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #0066cc;">
              <h1 style="color: #0066cc; margin: 0;">${SITE_NAME}</h1>
              <p style="color: #666; margin: 5px 0;">Comprobante de Reserva</p>
            </div>

            <!-- Reservation Details -->
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">¡Reserva Confirmada!</h2>
              
              <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 40%;">N° Reserva:</td>
                    <td style="padding: 8px 0;">#${reservation.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Fecha:</td>
                    <td style="padding: 8px 0;">${reservation.date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Hora:</td>
                    <td style="padding: 8px 0;">${reservation.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Servicio:</td>
                    <td style="padding: 8px 0;">${reservation.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Duración:</td>
                    <td style="padding: 8px 0;">${reservation.duration}</td>
                  </tr>
                  <tr style="border-top: 1px solid #ddd;">
                    <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
                    <td style="padding: 12px 0; font-size: 18px; color: #28a745; font-weight: bold;">${reservation.cost}</td>
                  </tr>
                </table>
              </div>

              <!-- Instructions -->
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1976d2;">Instrucciones importantes:</h3>
                <ul style="margin: 0; color: #666;">
                  <li>Llega 10 minutos antes de tu reserva</li>
                  <li>Trae toalla y traje de baño</li>
                  <li>Presenta este comprobante en recepción</li>
                  <li>Puedes cancelar hasta 2 horas antes</li>
                </ul>
              </div>

              <!-- Actions -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${SITE_URL}/reservas/${reservation.id}" 
                   style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
                  Ver Detalles
                </a>
                <a href="${SITE_URL}/reservas/${reservation.id}/cancel" 
                   style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Cancelar Reserva
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>Si tienes preguntas, contacta con nosotros:</p>
              <p>📞 +56 9 1234 5678 | 📧 contacto@aguasabiertaschiloe.cl</p>
              <p>© ${new Date().getFullYear()} ${SITE_NAME}. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  // Email de recordatorio de reserva
  static reservationReminder(to: string, reservation: any): EmailTemplate {
    return {
      to,
      subject: `Recordatorio: Tu reserva es mañana - ${SITE_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recordatorio de Reserva</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 20px 0;">
              <h1 style="color: #0066cc;">${SITE_NAME}</h1>
            </div>
            
            <div style="background: #fff3cd; padding: 30px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h2 style="color: #856404; margin-top: 0;">🏊‍♀️ ¡No olvides tu reserva!</h2>
              
              <p>Te recordamos que tienes una reserva programada:</p>
              
              <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>📅 Fecha:</strong> ${reservation.date}</p>
                <p><strong>🕒 Hora:</strong> ${reservation.time}</p>
                <p><strong>🏊 Servicio:</strong> ${reservation.service}</p>
                <p><strong>📋 Reserva #:</strong> ${reservation.id}</p>
              </div>
              
              <p>¡Te esperamos!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${SITE_URL}/reservas/${reservation.id}" 
                   style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Ver Reserva
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
}

// Servicio principal de emails
export class EmailService {
  
  // Enviar email genérico
  static async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        to: template.to,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Métodos específicos para emails transaccionales
  static async sendReservationConfirmation(to: string, reservationDetails: any): Promise<boolean> {
    const template = EmailTemplates.reservationConfirmation(to, reservationDetails);
    return this.sendEmail(template);
  }

  static async sendReservationReminder(to: string, reservationDetails: any): Promise<boolean> {
    const template = EmailTemplates.reservationReminder(to, reservationDetails);
    return this.sendEmail(template);
  }

  // Verificar configuración de Resend
  static async testConfiguration(): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default EmailService; 