import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/config/auth';

/**
 * Wrapper para controladores que requieren autenticación
 * Convierte Request a AuthenticatedRequest de forma type-safe
 * 
 * @param handler - Controlador que requiere usuario autenticado
 * @returns RequestHandler compatible con Express Router
 */
export const withAuth = (
  handler: (req: AuthenticatedRequest, res: Response) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // El middleware protect garantiza que req.user existe en este punto
      await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Wrapper para controladores que requieren autenticación y autorización
 * Igual que withAuth pero con nombre más descriptivo para rutas con roles
 * 
 * @param handler - Controlador que requiere usuario autenticado y autorizado
 * @returns RequestHandler compatible con Express Router
 */
export const withAuthAndRole = (
  handler: (req: AuthenticatedRequest, res: Response) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Los middleware protect + authorize garantizan que req.user existe y tiene permisos
      await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      next(error);
    }
  };
}; 