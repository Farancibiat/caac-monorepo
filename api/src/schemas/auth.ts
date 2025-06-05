import { z } from 'zod';
import { commonSchemas } from './common';

// Schemas para autenticación
export const authSchemas = {
  // Actualización de perfil
  updateProfile: z.object({
    name: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
  }).refine(
    (data) => data.name !== undefined || data.phone !== undefined,
    'Debe proporcionar al menos un campo para actualizar'
  ),

  // Login (aunque se use Supabase, para validar si llega al endpoint)
  login: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
  }),

  // Registro (aunque se use Supabase, para validar si llega al endpoint)
  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
  }),

  // Cambio de contraseña
  changePassword: z.object({
    currentPassword: commonSchemas.password,
    newPassword: commonSchemas.password,
  }).refine(
    (data) => data.currentPassword !== data.newPassword,
    'La nueva contraseña debe ser diferente a la actual'
  ),
};

// Tipos inferidos automáticamente
export type UpdateProfileData = z.infer<typeof authSchemas.updateProfile>;
export type LoginData = z.infer<typeof authSchemas.login>;
export type RegisterData = z.infer<typeof authSchemas.register>;
export type ChangePasswordData = z.infer<typeof authSchemas.changePassword>; 