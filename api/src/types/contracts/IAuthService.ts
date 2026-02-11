import { User } from '@prisma/client';
import { ServiceResult } from '../common';

/**
 * Contrato para service de autenticación
 */
export type IAuthService = {
  getProfile(authId: string): Promise<ServiceResult<User>>;
  updateProfile(authId: string, data: { name?: string; phone?: string }): Promise<ServiceResult<User>>;
  checkProfileStatus(authId: string): Promise<ServiceResult<{
    profileCompleted: boolean;
    missingFields: {
      name: boolean;
      phone: boolean;
    };
  }>>;
};

