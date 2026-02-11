import { Profile, User, Club } from '@prisma/client';

/**
 * Tipo para perfil con relaciones
 */
export type ProfileWithRelations = Profile & {
  club?: Club | null;
  user: Pick<User, 'email' | 'name' | 'avatar_url'>;
};

/**
 * Tipo para datos de creación/actualización de perfil
 */
export type ProfileData = {
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: Date;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  sexo: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  clubId?: number;
};

/**
 * Contrato para repositorio de perfiles
 */
export type IProfileRepository = {
  findByUserId(userId: number): Promise<ProfileWithRelations | null>;
  findByUserAuthId(authId: string): Promise<{ profile: ProfileWithRelations | null; userId: number | null }>;
  create(userId: number, data: ProfileData): Promise<Profile>;
  update(userId: number, data: Partial<ProfileData>): Promise<Profile>;
  delete(userId: number): Promise<void>;
  checkClubExists(clubId: number): Promise<boolean>;
};

