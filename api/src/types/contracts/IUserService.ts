import { User } from '@prisma/client';
import { ServiceResult } from '../common';

/**
 * Contrato para service de usuarios
 */
export type IUserService = {
  getAllUsers(): Promise<ServiceResult<User[]>>;
  getUserById(id: number): Promise<ServiceResult<User>>;
  createUser(data: {
    email: string;
    name: string;
    password: string;
    phone?: string;
    role?: string;
  }): Promise<ServiceResult<User>>;
  getUserProfile(authId: string): Promise<ServiceResult<User>>;

  /** Solo ADMIN. Actualiza el campo socio del usuario (precio 2000 vs 3000). */
  updateUserSocio(userId: number, socio: boolean): Promise<ServiceResult<User>>;
};

