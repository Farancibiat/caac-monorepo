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

// Rate limiter específico para formulario de contacto
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 2, // 2 mensajes de contacto por IP cada hora
  message: (_req: Request, res: Response) => {
    return sendMessage(res, 'RATE_LIMIT_CONTACT_EXCEEDED');
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Usar IP + User-Agent para una identificación más específica
    return `${req.ip}-${req.get('User-Agent') || 'unknown'}`;
  }
}); 