import { PrismaClient, User, Role } from '@prisma/client';
import { IUserRepository } from '@/types';

/**
 * Repository para operaciones de usuarios
 * Factory Function que encapsula acceso a datos de usuarios
 */
export const createUserRepository = (prisma: PrismaClient): IUserRepository => ({

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  },

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { reservations: true },
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
    });
  },

  async create(data: {
    auth_id: string;
    email: string;
    name: string;
    phone?: string | undefined;
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
        ...(data.phone !== undefined && { phone: data.phone }),
        role: data.role ?? Role.USER,
        isActive: data.isActive ?? true,
        provider: data.provider ?? 'email',
        profileCompleted: data.profileCompleted ?? !!(data.name && data.phone),
      },
    });
  },

  async updateSocio(id: number, socio: boolean): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { socio },
    });
  },

});

