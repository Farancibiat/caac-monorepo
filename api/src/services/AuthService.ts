import { User } from '@prisma/client';
import { IAuthService, IAuthRepository, ServiceResult, ServiceResultHelper } from '@/types';

/**
 * Factory function para crear service de autenticación
 * Contiene lógica de negocio extraída de authController
 */
export const createAuthService = (authRepo: IAuthRepository): IAuthService => ({

  async getProfile(authId: string): Promise<ServiceResult<User>> {
    try {
      const user = await authRepo.findByAuthId(authId);

      if (!user) {
        return ServiceResultHelper.error('AUTH_USER_NOT_FOUND');
      }

      return ServiceResultHelper.success(user);
    } catch (error) {
      return ServiceResultHelper.error('AUTH_PROFILE_ERROR');
    }
  },

  async updateProfile(authId: string, data: { name?: string; phone?: string }): Promise<ServiceResult<User>> {
    try {
      // Preparar datos para actualización (solo campos permitidos)
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.phone !== undefined) updateData.phone = data.phone;

      // Obtener estado actual del usuario
      const currentUser = await authRepo.findByAuthId(authId);

      if (!currentUser) {
        return ServiceResultHelper.error('AUTH_USER_NOT_FOUND');
      }

      // Determinar si el perfil estará completo después de la actualización
      const updatedName = data.name !== undefined ? data.name : currentUser.name;
      const updatedPhone = data.phone !== undefined ? data.phone : currentUser.phone;
      const willBeCompleted = !!(updatedName && updatedPhone);

      // Si el perfil va a estar completo y no estaba antes, marcarlo como completado
      if (willBeCompleted && !currentUser.profileCompleted) {
        updateData.profileCompleted = true;
      }

      // Actualizar usuario
      const updatedUser = await authRepo.updateProfile(authId, updateData);

      return ServiceResultHelper.success(updatedUser);
    } catch (error) {
      return ServiceResultHelper.error('AUTH_UPDATE_ERROR');
    }
  },

  async checkProfileStatus(authId: string): Promise<ServiceResult<{
    profileCompleted: boolean;
    missingFields: {
      name: boolean;
      phone: boolean;
    };
  }>> {
    try {
      const profileData = await authRepo.checkProfileCompleteness(authId);

      if (!profileData) {
        return ServiceResultHelper.error('AUTH_USER_NOT_FOUND');
      }

      return ServiceResultHelper.success({
        profileCompleted: profileData.profileCompleted,
        missingFields: {
          name: !profileData.name,
          phone: !profileData.phone,
        },
      });
    } catch (error) {
      return ServiceResultHelper.error('AUTH_PROFILE_ERROR');
    }
  },

});

