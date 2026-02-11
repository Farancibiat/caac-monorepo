import { Profile } from '@prisma/client';
import { 
  IProfileService, 
  IProfileRepository, 
  ServiceResult, 
  ServiceResultHelper,
  ProfileData,
  ProfileResponse
} from '@/types';

/**
 * Factory function para crear service de perfiles
 * Contiene lógica de negocio extraída de profileController
 */
export const createProfileService = (profileRepo: IProfileRepository): IProfileService => ({

  async getProfile(authId: string): Promise<ServiceResult<ProfileResponse>> {
    try {
      const { profile, userId } = await profileRepo.findByUserAuthId(authId);

      if (!userId) {
        return ServiceResultHelper.error('USER_NOT_FOUND');
      }

      if (!profile) {
        return ServiceResultHelper.error('PROFILE_NOT_FOUND');
      }

      const responseData: ProfileResponse = {
        nombre: profile.nombre,
        primerApellido: profile.primerApellido,
        segundoApellido: profile.segundoApellido || undefined,
        fechaNacimiento: profile.fechaNacimiento,
        telefono: profile.telefono,
        direccion: profile.direccion,
        comuna: profile.comuna,
        region: profile.region,
        sexo: profile.sexo.toLowerCase(),
        clubId: profile.clubId || undefined,
      };

      return ServiceResultHelper.success(responseData);
    } catch (error) {
      return ServiceResultHelper.error('PROFILE_FETCH_ERROR');
    }
  },

  async createProfile(authId: string, data: ProfileData): Promise<ServiceResult<Profile>> {
    try {
      // Validar campos requeridos
      if (!data.nombre || !data.primerApellido || !data.fechaNacimiento || 
          !data.telefono || !data.direccion || !data.comuna || !data.region || !data.sexo) {
        return ServiceResultHelper.error('PROFILE_MISSING_REQUIRED_FIELDS');
      }

      // Validar sexo
      if (!['MASCULINO', 'FEMENINO', 'OTRO'].includes(data.sexo)) {
        return ServiceResultHelper.error('PROFILE_INVALID_SEXO');
      }

      // Obtener userId del authId
      const { userId } = await profileRepo.findByUserAuthId(authId);
      
      if (!userId) {
        return ServiceResultHelper.error('USER_NOT_FOUND');
      }

      // Verificar que el perfil no existe ya
      const existingProfile = await profileRepo.findByUserId(userId);
      if (existingProfile) {
        return ServiceResultHelper.error('USER_EMAIL_ALREADY_EXISTS'); // Usar código existente
      }

      // Validar club si se proporciona
      if (data.clubId) {
        const clubExists = await profileRepo.checkClubExists(data.clubId);
        if (!clubExists) {
          return ServiceResultHelper.error('PROFILE_INVALID_CLUB');
        }
      }

      const newProfile = await profileRepo.create(userId, data);
      return ServiceResultHelper.success(newProfile);
    } catch (error) {
      return ServiceResultHelper.error('PROFILE_CREATE_ERROR');
    }
  },

  async updateProfile(authId: string, data: Partial<ProfileData>): Promise<ServiceResult<Profile>> {
    try {
      // Obtener userId del authId
      const { profile, userId } = await profileRepo.findByUserAuthId(authId);
      
      if (!userId) {
        return ServiceResultHelper.error('USER_NOT_FOUND');
      }

      if (!profile) {
        return ServiceResultHelper.error('PROFILE_NOT_FOUND');
      }

      // Validar sexo si se está actualizando
      if (data.sexo && !['MASCULINO', 'FEMENINO', 'OTRO'].includes(data.sexo)) {
        return ServiceResultHelper.error('PROFILE_INVALID_SEXO');
      }

      // Validar club si se está actualizando
      if (data.clubId) {
        const clubExists = await profileRepo.checkClubExists(data.clubId);
        if (!clubExists) {
          return ServiceResultHelper.error('PROFILE_INVALID_CLUB');
        }
      }

      const updatedProfile = await profileRepo.update(userId, data);
      return ServiceResultHelper.success(updatedProfile);
    } catch (error) {
      return ServiceResultHelper.error('PROFILE_UPDATE_ERROR');
    }
  },

  async deleteProfile(authId: string): Promise<ServiceResult<void>> {
    try {
      // Obtener userId del authId
      const { profile, userId } = await profileRepo.findByUserAuthId(authId);
      
      if (!userId) {
        return ServiceResultHelper.error('USER_NOT_FOUND');
      }

      if (!profile) {
        return ServiceResultHelper.error('PROFILE_NOT_FOUND');
      }

      await profileRepo.delete(userId);
      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('PROFILE_DELETE_ERROR');
    }
  },

});
