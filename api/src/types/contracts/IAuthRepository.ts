import { User } from '@prisma/client';

/**
 * Contrato para repositorio de autenticación
 */
export type IAuthRepository = {
  findByAuthId(authId: string): Promise<User | null>;
  updateProfile(authId: string, data: Partial<User>): Promise<User>;
  checkProfileCompleteness(authId: string): Promise<{ 
    profileCompleted: boolean; 
    name: boolean; 
    phone: boolean; 
  } | null>;
};

