import { Response } from 'express';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { getProfileService } from '@/config/container';

/**
 * CONTROLADOR DE PERFILES - Patrón CSR
 * 
 * Cambios principales:
 * - Eliminado acceso directo a Prisma
 * - Toda la lógica movida a ProfileService
 * - Solo HTTP handling
 * - Consistente con arquitectura CSR
 */

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const profileService = getProfileService();

    const result = await profileService.getProfile(req.user.auth_id);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'PROFILE_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'PROFILE_FETCH_ERROR');
  }
};

export const createProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const profileService = getProfileService();

    const result = await profileService.createProfile(req.user.auth_id, req.body);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'PROFILE_CREATED', result.data);
  } catch (error) {
    sendMessage(res, 'PROFILE_CREATE_ERROR');
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const profileService = getProfileService();

    const result = await profileService.updateProfile(req.user.auth_id, req.body);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'PROFILE_UPDATED', result.data);
  } catch (error) {
    sendMessage(res, 'PROFILE_UPDATE_ERROR');
  }
};

export const deleteProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const profileService = getProfileService();

    const result = await profileService.deleteProfile(req.user.auth_id);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'PROFILE_DELETED');
  } catch (error) {
    sendMessage(res, 'PROFILE_DELETE_ERROR');
  }
};