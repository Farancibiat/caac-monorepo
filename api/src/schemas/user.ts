import { z } from 'zod';
import { commonSchemas, createParamIdSchema, createPaginationSchema } from './common';

// Schemas para usuarios
export const userSchemas = {
  // Parámetros
  params: {
    id: createParamIdSchema(),
  },

  // Query strings
  query: {
    list: createPaginationSchema(),
  },

  // Creación de usuario
  create: z.object({
    email: commonSchemas.email,
    name: commonSchemas.name,
    password: commonSchemas.password,
    phone: commonSchemas.phone.optional(),
    role: commonSchemas.role.default('USER'),
  }),

  // Actualización de usuario (admin)
  update: z.object({
    name: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
    role: commonSchemas.role.optional(),
    isActive: commonSchemas.boolean.optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    'Debe proporcionar al menos un campo para actualizar'
  ),

  // Actualización de perfil de usuario
  updateProfile: z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    primerApellido: z.string().min(1, 'El primer apellido es requerido'),
    segundoApellido: z.string().optional(),
    fechaNacimiento: z.string().datetime('Fecha de nacimiento inválida'),
    telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    direccion: z.string().min(1, 'La dirección es requerida'),
    comuna: z.string().min(1, 'La comuna es requerida'),
    region: z.string().min(1, 'La región es requerida'),
    sexo: z.enum(['masculino', 'femenino', 'otro']),
    clubId: z.string().min(1, 'El club es requerido'),
  }),
};

// Tipos inferidos
export type CreateUserData = z.infer<typeof userSchemas.create>;
export type UpdateUserData = z.infer<typeof userSchemas.update>;
export type UpdateProfileData = z.infer<typeof userSchemas.updateProfile>;
export type UserListQuery = z.infer<typeof userSchemas.query.list>;
export type UserParamsId = z.infer<typeof userSchemas.params.id>; 