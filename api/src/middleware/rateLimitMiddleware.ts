import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { sendMessage } from '@/utils/responseHelper';

// Rate limiter general para toda la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // 200 requests por IP cada 15 min
  message: (_req: Request, res: Response) => {
    return sendMessage(res, 'RATE_LIMIT_EXCEEDED');
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting para la ruta de salud
    return req.path === '/';
  }
});

// Rate limiter específico para endpoints de autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos de auth por IP cada 15 min
  message: (_req: Request, res: Response) => {
    return sendMessage(res, 'RATE_LIMIT_AUTH_EXCEEDED');
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 