import fs from 'fs';
import path from 'path';

/**
 * Procesa un template HTML reemplazando variables y condicionales con datos dinámicos
 * 
 * @param templateName - Nombre del archivo template (sin extensión .html)
 * @param data - Datos para reemplazar en el template
 * @returns string - HTML procesado con las variables reemplazadas
 * 
 * @description
 * Este motor de plantillas soporta:
 * - Variables simples: {{variable}}
 * - Condicionales: {{#variable}} contenido {{/variable}}
 * - Variables de entorno automáticas: SITE_NAME, SITE_URL, CURRENT_YEAR
 * 
 * @example
 * ```typescript
 * const html = processTemplate('contactMessage', {
 *   nombre: 'Juan Pérez',
 *   email: 'juan@example.com',
 *   telefono: '+56912345678' // opcional
 * });
 * ```
 * 
 * @throws {Error} Si el archivo template no existe o hay error de procesamiento
 */
export const processTemplate = (templateName: string, data: Record<string, any>): string => {
  try {
    // Leer el archivo HTML
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf-8');

    // Agregar variables de entorno automáticamente
    const envData: Record<string, any> = {
      SITE_NAME: process.env.SITE_NAME || 'Club de Aguas Abiertas Chiloé',
      SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
      CURRENT_YEAR: new Date().getFullYear().toString(),
      ...data // Los datos específicos del template tienen prioridad
    };

    // Reemplazar variables simples {{variable}}
    html = html.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => {
      return envData[key] !== undefined ? String(envData[key]) : match;
    });

    // Manejar condicionales {{#variable}} contenido {{/variable}}
    html = html.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key: string, content: string) => {
      const value = envData[key];
      // Si la variable existe y no está vacía, mostrar el contenido
      if (value && value !== '' && value !== null && value !== undefined) {
        // Procesar el contenido interno también
        return content.replace(/\{\{(\w+)\}\}/g, (innerMatch: string, innerKey: string) => {
          return envData[innerKey] !== undefined ? String(envData[innerKey]) : innerMatch;
        });
      }
      return ''; // Si no existe o está vacía, no mostrar nada
    });

    return html;
  } catch (error) {
    console.error(`Error processing template ${templateName}:`, error);
    throw new Error(`Failed to process email template: ${templateName}`);
  }
}; 