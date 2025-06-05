import { Request, Response } from 'express';
import prisma from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';

// Obtener perfil del usuario actual
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
      return;
    }

    // Buscar usuario por auth_id en lugar de id numérico
    const user = await prisma.user.findUnique({
      where: { auth_id: req.user.auth_id },
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

    if (!user) {
      sendMessage(res, 'AUTH_USER_NOT_FOUND');
      return;
    }

    sendMessage(res, 'AUTH_PROFILE_RETRIEVED', user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    sendMessage(res, 'AUTH_PROFILE_ERROR');
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
      return;
    }

    const { name, phone } = req.body;

    // Preparar datos para actualización (solo campos permitidos)
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    // Si no hay campos para actualizar
    if (Object.keys(updateData).length === 0) {
      sendMessage(res, 'AUTH_UPDATE_ERROR');
      return;
    }

    // Obtener estado actual del usuario
    const currentUser = await prisma.user.findUnique({
      where: { auth_id: req.user.auth_id },
      select: { name: true, phone: true, profileCompleted: true },
    });

    if (!currentUser) {
      sendMessage(res, 'AUTH_USER_NOT_FOUND');
      return;
    }

    // Determinar si el perfil estará completo después de la actualización
    const updatedName = name !== undefined ? name : currentUser.name;
    const updatedPhone = phone !== undefined ? phone : currentUser.phone;
    const willBeCompleted = !!(updatedName && updatedPhone);

    // Si el perfil va a estar completo y no estaba antes, marcarlo como completado
    if (willBeCompleted && !currentUser.profileCompleted) {
      updateData.profileCompleted = true;
    }

    // Actualizar usuario usando auth_id
    const updatedUser = await prisma.user.update({
      where: { auth_id: req.user.auth_id },
      data: updateData,
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

    sendMessage(res, 'AUTH_PROFILE_UPDATED', updatedUser);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    sendMessage(res, 'AUTH_UPDATE_ERROR');
  }
};

// Verificar si el perfil está completo
export const checkProfileStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { auth_id: req.user.auth_id },
      select: {
        profileCompleted: true,
        name: true,
        phone: true,
      },
    });

    if (!user) {
      sendMessage(res, 'AUTH_USER_NOT_FOUND');
      return;
    }

    sendMessage(res, 'AUTH_PROFILE_RETRIEVED', {
      profileCompleted: user.profileCompleted,
      missingFields: {
        name: !user.name,
        phone: !user.phone,
      },
    });
  } catch (error) {
    console.error('Error al verificar estado del perfil:', error);
    sendMessage(res, 'AUTH_PROFILE_ERROR');
  }
}; 