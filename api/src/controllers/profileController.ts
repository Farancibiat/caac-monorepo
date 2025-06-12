import { Response } from 'express';
import prisma from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { auth_id: req.user.auth_id }
    });

    if (!user) {
      sendMessage(res, 'USER_NOT_FOUND');
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        club: true,
        user: {
          select: {
            email: true,
            name: true,
            avatar_url: true
          }
        }
      }
    });

    if (!profile) {
      sendMessage(res, 'PROFILE_NOT_FOUND');
      return;
    }

    const responseData = {
      nombre: profile.nombre,
      primerApellido: profile.primerApellido,
      segundoApellido: profile.segundoApellido,
      fechaNacimiento: profile.fechaNacimiento,
      telefono: profile.telefono,
      direccion: profile.direccion,
      comuna: profile.comuna,
      region: profile.region,
      sexo: profile.sexo,
      clubId: profile.clubId
    };

    sendMessage(res, 'PROFILE_RETRIEVED', responseData);

  } catch (error) {
    sendMessage(res, 'PROFILE_FETCH_ERROR');
  }
};

export const upsertProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {

    const user = await prisma.user.findUnique({
      where: { auth_id: req.user.auth_id }
    });

    if (!user) {
      sendMessage(res, 'USER_NOT_FOUND');
      return;
    }

    const {
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      telefono,
      direccion,
      comuna,
      region,
      sexo,
      clubId
    } = req.body;

    // Mapear valores de sexo del frontend al enum de Prisma
    const sexoMap = {
      'masculino': 'MASCULINO',
      'femenino': 'FEMENINO', 
      'otro': 'OTRO'
    } as const;

    // Validar que el sexo sea válido
    if (!sexoMap[sexo as keyof typeof sexoMap]) {
      sendMessage(res, 'PROFILE_INVALID_SEXO');
      return;
    }

    const profileData = {
      nombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento: new Date(fechaNacimiento),
      telefono,
      direccion,
      comuna,
      region,
      sexo: sexoMap[sexo as keyof typeof sexoMap],
      clubId,
      updatedAt: new Date()
    };

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        ...profileData,
        userId: user.id
      },
      include: {
        club: true
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: `${nombre} ${primerApellido} ${segundoApellido}`,
        phone: telefono,
        profileCompleted: true,
        updatedAt: new Date()
      }
    });

    sendMessage(res, 'PROFILE_UPDATED', {
      id: profile.id,
      clubId: profile.clubId
    });

  } catch (error) {
    console.error(error);
    sendMessage(res, 'PROFILE_UPDATE_ERROR');
  }
};

export const deleteProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { auth_id: req.user.auth_id }
    });

    if (!user) {
      sendMessage(res, 'USER_NOT_FOUND');
      return;
    }

    await prisma.profile.delete({
      where: { userId: user.id }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        profileCompleted: false,
        updatedAt: new Date()
      }
    });

    sendMessage(res, 'PROFILE_DELETED');

  } catch (error: any) {
    if (error.code === 'P2025') {
      sendMessage(res, 'PROFILE_NOT_FOUND');
      return;
    }

    sendMessage(res, 'PROFILE_DELETE_ERROR');
  }
}; 