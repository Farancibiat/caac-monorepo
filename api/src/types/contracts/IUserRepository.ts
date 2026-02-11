import { User, Role } from '@prisma/client';

/**
 * Contrato para repositorio de usuarios
 */
export type IUserRepository = {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAuthId(authId: string): Promise<User | null>;
  create(data: {
    auth_id: string;
    email: string;
    name: string;
    phone?: string;
    role?: Role;
    isActive?: boolean;
    provider?: string;
    profileCompleted?: boolean;
  }): Promise<User>;
};

