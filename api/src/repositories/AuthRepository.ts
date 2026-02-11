import { PrismaClient, User } from '@prisma/client';
import { IAuthRepository } from '@/types';

/**
 * Repository para operaciones de autenticación
 * Factory Function que encapsula acceso a datos de auth
 */
export const createAuthRepository = (prisma: PrismaClient): IAuthRepository => ({

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

  async updateProfile(authId: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { auth_id: authId },
      data,
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

  async checkProfileCompleteness(authId: string): Promise<{ 
    profileCompleted: boolean; 
    name: boolean; 
    phone: boolean; 
  } | null> {
    const user = await prisma.user.findUnique({
      where: { auth_id: authId },
      select: {
        profileCompleted: true,
        name: true,
        phone: true,
      },
    });

    if (!user) return null;

    return {
      profileCompleted: user.profileCompleted,
      name: !!user.name,
      phone: !!user.phone,
    };
  },

});

