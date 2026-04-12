import { Profile } from '@prisma/client';
import {
  IProfileService,
  IProfileRepository,
  ServiceResult,
  ServiceResultHelper,
  ProfileData,
  ProfileResponse,
  ProfileSexo,
} from '@/types';

const PRISMA_SEXO_VALUES: readonly ProfileSexo[] = ['masculino', 'femenino', 'otro'];

function isValidProfileSexo(value: string | undefined): value is ProfileSexo {
  if (value === undefined || value === '') return false;
  return (PRISMA_SEXO_VALUES as readonly string[]).includes(value.toLowerCase());
}

function normalizeSexo(value: string): ProfileSexo {
  return value.toLowerCase() as ProfileSexo;
}

/**
 * Factory: lógica de negocio de perfiles.
 * `updateProfile` crea el perfil si el usuario existe pero aún no tiene fila (primer guardado tras registro).
 */
export const createProfileService = (profileRepo: IProfileRepository): IProfileService => {
  const service: IProfileService = {
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
        if (
          !data.nombre ||
          !data.primerApellido ||
          !data.fechaNacimiento ||
          !data.telefono ||
          !data.direccion ||
          !data.comuna ||
          !data.region ||
          !data.sexo
        ) {
          return ServiceResultHelper.error('PROFILE_MISSING_REQUIRED_FIELDS');
        }

        if (!isValidProfileSexo(data.sexo)) {
          return ServiceResultHelper.error('PROFILE_INVALID_SEXO');
        }

        const normalized: ProfileData = {
          ...data,
          sexo: normalizeSexo(data.sexo),
        };

        const { userId } = await profileRepo.findByUserAuthId(authId);

        if (!userId) {
          return ServiceResultHelper.error('USER_NOT_FOUND');
        }

        const existingProfile = await profileRepo.findByUserId(userId);
        if (existingProfile) {
          return ServiceResultHelper.error('USER_EMAIL_ALREADY_EXISTS');
        }

        if (normalized.clubId) {
          const clubExists = await profileRepo.checkClubExists(normalized.clubId);
          if (!clubExists) {
            return ServiceResultHelper.error('PROFILE_INVALID_CLUB');
          }
        }

        const newProfile = await profileRepo.create(userId, normalized);
        return ServiceResultHelper.success(newProfile);
      } catch (error) {
        return ServiceResultHelper.error('PROFILE_CREATE_ERROR');
      }
    },

    async updateProfile(authId: string, data: Partial<ProfileData>): Promise<ServiceResult<Profile>> {
      try {
        const { profile, userId } = await profileRepo.findByUserAuthId(authId);

        if (!userId) {
          return ServiceResultHelper.error('USER_NOT_FOUND');
        }

        if (!profile) {
          return service.createProfile(authId, data as ProfileData);
        }

        if (data.sexo !== undefined && !isValidProfileSexo(data.sexo)) {
          return ServiceResultHelper.error('PROFILE_INVALID_SEXO');
        }

        const payload: Partial<ProfileData> =
          data.sexo !== undefined ? { ...data, sexo: normalizeSexo(data.sexo) } : { ...data };

        if (payload.clubId) {
          const clubExists = await profileRepo.checkClubExists(payload.clubId);
          if (!clubExists) {
            return ServiceResultHelper.error('PROFILE_INVALID_CLUB');
          }
        }

        const updatedProfile = await profileRepo.update(userId, payload);
        return ServiceResultHelper.success(updatedProfile);
      } catch (error) {
        return ServiceResultHelper.error('PROFILE_UPDATE_ERROR');
      }
    },

    async deleteProfile(authId: string): Promise<ServiceResult<void>> {
      try {
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
  };

  return service;
};
