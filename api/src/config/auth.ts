import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { getUserFromToken } from '@/config/supabase';
import { sendMessage } from '@/utils/responseHelper';
import prisma from '@/config/db';

console.log('🔄 Cargando middleware de autenticación con Supabase...');

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;          // Cambiado de number a string (UUID de Supabase)
        email: string;
        role: Role;
        auth_id: string;     // ID de Supabase Auth
      };
    }
  }
}

// Middleware para proteger rutas usando Supabase Auth
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('🔒 Verificando autenticación para:', req.method, req.originalUrl);
    
    const authHeader = req.headers.authorization;
    
    // Verificar que el header esté presente y tenga el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token no encontrado o formato incorrecto');
      sendMessage(res, 'AUTH_NOT_AUTHORIZED');
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar que el token existe después del split
    if (!token) {
      console.log('❌ Token vacío después del split');
      sendMessage(res, 'AUTH_NOT_AUTHORIZED');
      return;
    }
    
    // Verificar token con Supabase
    console.log('🔍 Verificando token con Supabase...');
    const { user: supabaseUser, error } = await getUserFromToken(token);
    
    if (error || !supabaseUser) {
      console.log('❌ Token inválido:', error?.message || 'Usuario no encontrado');
      sendMessage(res, 'AUTH_TOKEN_INVALID');
      return;
    }

    console.log('✅ Token válido, usuario Supabase:', supabaseUser.email);

    // Obtener datos del usuario desde nuestra tabla usando auth_id
    const dbUser = await prisma.user.findUnique({
      where: { auth_id: supabaseUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        auth_id: true,
      },
    });

    if (!dbUser) {
      console.log('❌ Usuario no encontrado en BD local para auth_id:', supabaseUser.id);
      sendMessage(res, 'AUTH_USER_NOT_FOUND');
      return;
    }

    // Verificar que la cuenta esté activa
    if (!dbUser.isActive) {
      console.log('❌ Cuenta desactivada para usuario:', dbUser.email);
      sendMessage(res, 'AUTH_ACCOUNT_DISABLED');
      return;
    }

    console.log('✅ Usuario autenticado:', dbUser.email, 'Rol:', dbUser.role);

    // Agregar usuario al request
    req.user = {
      id: dbUser.id.toString(),
      email: dbUser.email || supabaseUser.email || '',
      role: dbUser.role,
      auth_id: dbUser.auth_id!,
    };

    next();
  } catch (error) {
    console.error('💥 Error en middleware de autenticación:', error);
    sendMessage(res, 'AUTH_TOKEN_INVALID');
  }
};

// Middleware para restringir acceso basado en roles
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log('❌ Usuario no autenticado para autorización');
      sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
      return;
    }

    if (allowedRoles.includes(req.user.role)) {
      console.log('✅ Usuario autorizado:', req.user.email, 'Rol:', req.user.role);
      next();
    } else {
      console.log('❌ Rol insuficiente:', req.user.role, 'Requerido:', allowedRoles);
      sendMessage(res, 'AUTH_INSUFFICIENT_PERMISSIONS');
    }
  };
};

console.log('✅ Middleware de autenticación Supabase cargado exitosamente'); 