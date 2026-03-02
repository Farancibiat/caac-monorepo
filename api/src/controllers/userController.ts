import { Response } from 'express';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { getUserService } from '@/config/container';

/**
 * CONTROLADOR DE USUARIOS - Patrón CSR
 * 
 * Cambios principales:
 * - Eliminado acceso directo a Prisma y Supabase
 * - Toda la lógica movida a UserService
 * - Solo HTTP handling
 * - Consistente con arquitectura CSR
 */

export const getUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userService = getUserService();
    
    const result = await userService.getAllUsers();
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'USER_LIST_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'USER_FETCH_ERROR');
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userService = getUserService();
    
    const result = await userService.getUserById(Number(id));
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'USER_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'USER_FETCH_ERROR');
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, name, password, phone, role } = req.body;
    const userService = getUserService();
    
    const result = await userService.createUser({
      email,
      name,
      password,
      phone,
      role,
    });
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'USER_CREATED', result.data);
  } catch (error) {
    sendMessage(res, 'USER_CREATE_ERROR');
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userService = getUserService();
    
    const result = await userService.getUserProfile(req.user.auth_id);
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'USER_PROFILE_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'USER_FETCH_ERROR');
  }
};

/** Solo ADMIN. Actualiza el campo socio del usuario. */
export const updateUserSocio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { socio } = req.body as { socio: boolean };
    const userService = getUserService();

    const result = await userService.updateUserSocio(Number(id), socio);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'USER_SOCIO_UPDATED', result.data);
  } catch (error) {
    sendMessage(res, 'USER_UPDATE_ERROR');
  }
};