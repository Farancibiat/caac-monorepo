import { PrismaClient, Profile } from '@prisma/client';
import { IProfileRepository, ProfileWithRelations, ProfileData } from '@/types';

/**
 * Repository para operaciones de perfiles
 * Factory Function que encapsula acceso a datos de perfiles
 */
export const createProfileRepository = (prisma: PrismaClient): IProfileRepository => ({

  async findByUserId(userId: number): Promise<ProfileWithRelations | null> {
    return await prisma.profile.findUnique({
      where: { userId },
      include: {
        club: true,
        user: {
          select: {
            email: true,
            name: true,
            avatar_url: true,
          },
        },
      },
    });
  },

  async findByUserAuthId(authId: string): Promise<{ profile: ProfileWithRelations | null; userId: number | null }> {
    const user = await prisma.user.findUnique({
      where: { auth_id: authId },
      select: { id: true },
    });

    if (!user) {
      return { profile: null, userId: null };
    }

    const profile = await this.findByUserId(user.id);
    return { profile, userId: user.id };
  },

  async create(userId: number, data: ProfileData): Promise<Profile> {
    return await prisma.profile.create({
      data: {
        userId,
        ...data,
      },
    });
  },

  async update(userId: number, data: Partial<ProfileData>): Promise<Profile> {
    return await prisma.profile.update({
      where: { userId },
      data,
    });
  },

  async delete(userId: number): Promise<void> {
    await prisma.profile.delete({
      where: { userId },
    });
  },

  async checkClubExists(clubId: number): Promise<boolean> {
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });
    
    return !!club;
  },

});

