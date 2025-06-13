import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Tipo para especificar qué partes del request validar
type ValidationTarget = 'body' | 'params' | 'query';

interface ValidationSchemas {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
}

// Middleware universal de validación
export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ field: string; message: string; location: ValidationTarget }> = [];

    // Validar cada parte del request
    for (const [location, schema] of Object.entries(schemas) as Array<[ValidationTarget, ZodSchema<any>]>) {
      if (!schema) continue;

      const result = schema.safeParse(req[location]);
      
      if (!result.success) {
        // Transformar errores de Zod al formato esperado
        const locationErrors = result.error.errors.map(err => ({
          field: err.path.length > 0 ? err.path.join('.') : location,
          message: err.message,
          location
        }));
        
        errors.push(...locationErrors);
      } else if (location === 'body' || location === 'params') {
        req[location] = result.data;
      }
    }

    // Si hay errores, responder con formato estándar
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors
      });
      return;
    }

    next();
  };
};

// Helpers específicos para casos comunes
export const validateBody = (schema: ZodSchema<any>) => validate({ body: schema });
export const validateParams = (schema: ZodSchema<any>) => validate({ params: schema });
export const validateQuery = (schema: ZodSchema<any>) => validate({ query: schema });

// Helper para validar múltiples partes a la vez
export const validateAll = (
  bodySchema?: ZodSchema<any>,
  paramsSchema?: ZodSchema<any>,
  querySchema?: ZodSchema<any>
) => validate({
  ...(bodySchema && { body: bodySchema }),
  ...(paramsSchema && { params: paramsSchema }),
  ...(querySchema && { query: querySchema })
});

// Middleware para transformar strings vacíos en undefined (útil para campos opcionales)
export const cleanEmptyStrings = (req: Request, _res: Response, next: NextFunction) => {
  const clean = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const cleaned: any = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      const value = obj[key];
      if (value === '') {
        cleaned[key] = undefined;
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = clean(value);
      } else {
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  };

  // Solo limpiar req.body para peticiones PUT/POST/PATCH
  if (req.body && Object.keys(req.body).length > 0) {
    req.body = clean(req.body);
  }
  
  next();
}; 