import { PrismaClient, Profile, Prisma, Sexo } from '@prisma/client';
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
        nombre: data.nombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido ?? '',
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono,
        direccion: data.direccion,
        comuna: data.comuna,
        region: data.region,
        sexo: data.sexo.toLowerCase() as Sexo,
        ...(data.clubId !== undefined && { clubId: data.clubId }),
      },
    });
  },

  async update(userId: number, data: Partial<ProfileData>): Promise<Profile> {
    const updatePayload: Prisma.ProfileUpdateInput = {};
    if (data.nombre !== undefined) updatePayload.nombre = data.nombre;
    if (data.primerApellido !== undefined) updatePayload.primerApellido = data.primerApellido;
    if (data.segundoApellido !== undefined) updatePayload.segundoApellido = data.segundoApellido;
    if (data.fechaNacimiento !== undefined) updatePayload.fechaNacimiento = data.fechaNacimiento;
    if (data.telefono !== undefined) updatePayload.telefono = data.telefono;
    if (data.direccion !== undefined) updatePayload.direccion = data.direccion;
    if (data.comuna !== undefined) updatePayload.comuna = data.comuna;
    if (data.region !== undefined) updatePayload.region = data.region;
    if (data.sexo !== undefined) updatePayload.sexo = data.sexo.toLowerCase() as Sexo;
    if (data.clubId !== undefined) updatePayload.club = { connect: { id: data.clubId } };
    return await prisma.profile.update({
      where: { userId },
      data: updatePayload,
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

