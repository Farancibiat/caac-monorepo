import { z } from 'zod';

export const contactSchemas = {
  // Schema para envío de mensaje de contacto
  sendMessage: z.object({
    nombre: z.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios')
      .trim(),
    email: z.string()
      .email('Formato de email inválido')
      .max(255, 'Email muy largo'),
    telefono: z.string()
      .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de teléfono inválido')
      .min(8, 'Teléfono debe tener al menos 8 dígitos')
      .max(15, 'Teléfono muy largo')
      .optional(),
    asunto: z.string()
      .min(5, 'El asunto debe tener al menos 5 caracteres')
      .max(100, 'El asunto no puede exceder 100 caracteres')
      .trim(),
    mensaje: z.string()
      .min(10, 'El mensaje debe tener al menos 10 caracteres')
      .max(1000, 'El mensaje no puede exceder 1000 caracteres')
      .trim(),
  }),
};

// Tipos inferidos
export type SendContactMessageData = z.infer<typeof contactSchemas.sendMessage>; 