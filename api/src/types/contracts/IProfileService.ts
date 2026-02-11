import { Profile } from '@prisma/client';
import { ServiceResult } from '../common';
import { ProfileData, ProfileWithRelations } from './IProfileRepository';

/**
 * Tipo para respuesta de perfil formateada
 */
export type ProfileResponse = {
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: Date;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  sexo: string;
  clubId?: number;
};

/**
 * Contrato para service de perfiles
 */
export type IProfileService = {
  getProfile(authId: string): Promise<ServiceResult<ProfileResponse>>;
  createProfile(authId: string, data: ProfileData): Promise<ServiceResult<Profile>>;
  updateProfile(authId: string, data: Partial<ProfileData>): Promise<ServiceResult<Profile>>;
  deleteProfile(authId: string): Promise<ServiceResult<void>>;
};

