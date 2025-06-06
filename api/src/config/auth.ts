import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { getUserFromToken } from '@/config/supabase';
import { sendMessage } from '@/utils/responseHelper';
import prisma from '@/config/db';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        auth_id: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendMessage(res, 'AUTH_NOT_AUTHORIZED');
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      sendMessage(res, 'AUTH_NOT_AUTHORIZED');
      return;
    }
    
    const { user: supabaseUser, error } = await getUserFromToken(token);
    
    if (error || !supabaseUser) {
      sendMessage(res, 'AUTH_TOKEN_INVALID');
      return;
    }

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
      sendMessage(res, 'AUTH_USER_NOT_FOUND');
      return;
    }

    if (!dbUser.isActive) {
      sendMessage(res, 'AUTH_ACCOUNT_DISABLED');
      return;
    }

    req.user = {
      id: dbUser.id.toString(),
      email: dbUser.email || supabaseUser.email || '',
      role: dbUser.role,
      auth_id: dbUser.auth_id!,
    };

    next();
  } catch {
    sendMessage(res, 'AUTH_TOKEN_INVALID');
  }
};

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
      return;
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      sendMessage(res, 'AUTH_INSUFFICIENT_PERMISSIONS');
    }
  };
}; 