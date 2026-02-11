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
};

