// Exportar todos los schemas y tipos desde un lugar central
export * from './common';
export * from './auth';
export * from './user';

// Re-exportar validación middleware para conveniencia
export {
  validate,
  validateBody,
  validateParams,
  validateQuery,
  validateAll,
  cleanEmptyStrings
} from '../middleware/validationMiddleware';

// Objeto centralizado para acceder a todos los schemas
import { authSchemas } from './auth';
import { userSchemas } from './user';

export const schemas = {
  auth: authSchemas,
  user: userSchemas,
} as const;

// Tipos centralizados
export type {
  UpdateProfileData,
  LoginData,
  RegisterData,
  ChangePasswordData
} from './auth';

export type {
  CreateUserData,
  UpdateUserData,
  UserListQuery,
  UserParamsId
} from './user'; 