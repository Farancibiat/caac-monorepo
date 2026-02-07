import { Response } from 'express';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { getAuthService } from '@/config/container';

/**
 * CONTROLADOR DE AUTENTICACIÓN - Patrón CSR
 * 
 * Cambios principales:
 * - Eliminado acceso directo a Prisma
 * - Toda la lógica movida a AuthService
 * - Solo HTTP handling
 * - Consistente con arquitectura CSR
 */

// Obtener perfil del usuario actual
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authService = getAuthService();
    
    const result = await authService.getProfile(req.user.auth_id);
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'AUTH_PROFILE_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'AUTH_PROFILE_ERROR');
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;
    const authService = getAuthService();
    
    const result = await authService.updateProfile(req.user.auth_id, { name, phone });
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'AUTH_PROFILE_UPDATED', result.data);
  } catch (error) {
    sendMessage(res, 'AUTH_UPDATE_ERROR');
  }
};

// Verificar si el perfil está completo
export const checkProfileStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const authService = getAuthService();
    
    const result = await authService.checkProfileStatus(req.user.auth_id);
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'AUTH_PROFILE_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'AUTH_PROFILE_ERROR');
  }
};