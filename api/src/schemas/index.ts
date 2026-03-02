// Exportar todos los schemas y tipos desde un lugar central
export * from './common';
export * from './auth';
export * from './user';
export * from './reservation';
export * from './contact';

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
import { reservationSchemas } from './reservation';
import { contactSchemas } from './contact';

export const schemas = {
  auth: authSchemas,
  user: userSchemas,
  reservation: reservationSchemas,
  contact: contactSchemas,
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
  UpdateSocioData,
  UserListQuery,
  UserParamsId
} from './user';

export type {
  CreateReservationData,
  CancelReservationData,
  ConfirmPaymentData,
  CompleteReservationData,
} from './reservation';

export type {
  SendContactMessageData
} from './contact'; 