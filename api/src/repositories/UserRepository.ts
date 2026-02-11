import { PrismaClient, User, Role } from '@prisma/client';
import { IUserRepository } from '@/types';

/**
 * Repository para operaciones de usuarios
 * Factory Function que encapsula acceso a datos de usuarios
 */
export const createUserRepository = (prisma: PrismaClient): IUserRepository => ({

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
        reservations: true,
      },
    });
  },

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  async findByAuthId(authId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { auth_id: authId },
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async create(data: {
    auth_id: string;
    email: string;
    name: string;
    phone?: string;
    role?: Role;
    isActive?: boolean;
    provider?: string;
    profileCompleted?: boolean;
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        auth_id: data.auth_id,
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        role: data.role || Role.USER,
        isActive: data.isActive ?? true,
        provider: data.provider || 'email',
        profileCompleted: data.profileCompleted ?? !!(data.name && data.phone),
      },
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

});

