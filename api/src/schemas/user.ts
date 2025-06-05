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
};

// Tipos inferidos
export type CreateUserData = z.infer<typeof userSchemas.create>;
export type UpdateUserData = z.infer<typeof userSchemas.update>;
export type UserListQuery = z.infer<typeof userSchemas.query.list>;
export type UserParamsId = z.infer<typeof userSchemas.params.id>; 