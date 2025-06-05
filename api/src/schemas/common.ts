import { z } from 'zod';

// Esquemas básicos reutilizables
export const commonSchemas = {
  // IDs y números
  id: z.number().int().positive('ID debe ser un número positivo'),
  uuid: z.string().uuid('UUID inválido'),
  
  // Strings básicos
  email: z.string()
    .email('Formato de email inválido')
    .max(255, 'Email muy largo'),
  
  password: z.string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(100, 'Contraseña muy larga'),
  
  name: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre muy largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios'),
  
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de teléfono inválido')
    .min(8, 'Teléfono debe tener al menos 8 dígitos')
    .max(15, 'Teléfono muy largo'),
  
  // Fechas
  dateString: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  
  dateTime: z.string().datetime('Formato de fecha y hora inválido'),
  
  // Enums comunes
  role: z.enum(['USER', 'ADMIN'], {
    errorMap: () => ({ message: 'Rol debe ser USER o ADMIN' })
  }),
  
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    errorMap: () => ({ message: 'Estado debe ser ACTIVE o INACTIVE' })
  }),
  
  // Paginación
  page: z.number().int().min(1, 'Página debe ser mayor a 0').default(1),
  limit: z.number().int().min(1, 'Límite debe ser mayor a 0').max(100, 'Límite máximo es 100').default(10),
  
  // Booleanos
  boolean: z.boolean(),
  
  // Opcional con transformación
  optionalString: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
};

// Helper para crear schemas de parámetros de ID
export const createParamIdSchema = (idName = 'id') => z.object({
  [idName]: z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${idName} debe ser un número positivo`,
      });
      return z.NEVER;
    }
    return parsed;
  })
});

// Helper para crear schemas de query con paginación
export const createPaginationSchema = () => z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) || 1 : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val) || 10, 100) : 10),
  search: z.string().optional(),
}); 