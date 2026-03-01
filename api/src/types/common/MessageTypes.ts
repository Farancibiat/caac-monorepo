/**
 * Tipos estrictos para códigos de error de ServiceResult
 * Basados en los mensajes definidos en constants/messages.ts
 */

// Códigos de error para Reservas
export type ReservationErrorCode =
  | 'RESERVATION_NOT_FOUND'
  | 'RESERVATION_INSUFFICIENT_PERMISSIONS'
  | 'RESERVATION_CANNOT_CANCEL_COMPLETED'
  | 'RESERVATION_CANNOT_COMPLETE_CANCELLED'
  | 'RESERVATION_CANNOT_CONFIRM_CANCELLED'
  | 'RESERVATION_ALREADY_EXISTS'
  | 'RESERVATION_NO_CAPACITY'
  | 'RESERVATION_MISSING_REQUIRED_FIELDS'
  | 'RESERVATION_MISSING_PAYMENT_DATA'
  | 'RESERVATION_MISSING_AVAILABILITY_DATA'
  | 'RESERVATION_ID_REQUIRED'
  | 'RESERVATION_FETCH_ERROR'
  | 'RESERVATION_CREATE_ERROR'
  | 'RESERVATION_CANCEL_ERROR'
  | 'RESERVATION_COMPLETE_ERROR'
  | 'RESERVATION_PAYMENT_ERROR';

// Códigos de error para Horarios
export type ScheduleErrorCode =
  | 'SCHEDULE_NOT_FOUND'
  | 'SCHEDULE_INACTIVE'
  | 'SCHEDULE_INVALID_ID'
  | 'SCHEDULE_MISSING_REQUIRED_FIELDS'
  | 'SCHEDULE_FETCH_ERROR'
  | 'SCHEDULE_CREATE_ERROR'
  | 'SCHEDULE_UPDATE_ERROR'
  | 'SCHEDULE_DELETE_ERROR'
  | 'SCHEDULE_AVAILABILITY_ERROR';

// Códigos de error para Usuarios
export type UserErrorCode =
  | 'USER_NOT_FOUND'
  | 'USER_INVALID_ID'
  | 'USER_EMAIL_ALREADY_EXISTS'
  | 'USER_MISSING_REQUIRED_FIELDS'
  | 'USER_FETCH_ERROR'
  | 'USER_CREATE_ERROR'
  | 'USER_UPDATE_ERROR';

// Códigos de error para Autenticación
export type AuthErrorCode =
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_NOT_AUTHENTICATED'
  | 'AUTH_NOT_AUTHORIZED'
  | 'AUTH_INSUFFICIENT_PERMISSIONS'
  | 'AUTH_TOKEN_INVALID'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_ACCOUNT_DISABLED'
  | 'AUTH_PROFILE_ERROR'
  | 'AUTH_UPDATE_ERROR'
  | 'AUTH_LOGIN_ERROR';

// Códigos de error para Eventos
export type EventErrorCode =
  | 'EVENT_NOT_FOUND'
  | 'EVENT_ALREADY_EXISTS'
  | 'EVENT_INVALID_DATES'
  | 'EVENT_INVALID_COST'
  | 'EVENT_INVALID_SLUG'
  | 'EVENT_INVALID_EDITION'
  | 'EVENT_INVALID_EDITION_ORDER'
  | 'EVENT_FETCH_ERROR'
  | 'EVENT_CREATE_ERROR'
  | 'EVENT_UPDATE_ERROR'
  | 'EVENT_DELETE_ERROR'
  | 'EVENT_LINK_ERROR';

// Códigos de error para Perfiles (usando códigos existentes)
export type ProfileErrorCode =
  | 'PROFILE_NOT_FOUND'
  | 'PROFILE_INVALID_CLUB'
  | 'PROFILE_INVALID_SEXO'
  | 'PROFILE_MISSING_REQUIRED_FIELDS'
  | 'PROFILE_FETCH_ERROR'
  | 'PROFILE_CREATE_ERROR'
  | 'PROFILE_UPDATE_ERROR'
  | 'PROFILE_DELETE_ERROR';

// Códigos de error para Emails
export type EmailErrorCode =
  | 'EMAIL_SEND_ERROR'
  | 'EMAIL_CONFIG_ERROR'
  | 'EMAIL_CONFIG_INVALID'
  | 'CONTACT_INVALID_DATA';

// Códigos de error genéricos
export type GenericErrorCode =
  | 'INVALID_QUERY_PARAMETERS'
  | 'DATABASE_CONNECTION_ERROR'
  | 'DATABASE_TIMEOUT_ERROR'
  | 'DATABASE_ACCESS_DENIED_ERROR'
  | 'DATABASE_AUTH_ERROR'
  | 'DATABASE_NOT_FOUND_ERROR';

// Unión de todos los códigos de error válidos para ServiceResult
export type ServiceErrorCode = 
  | ReservationErrorCode
  | ScheduleErrorCode
  | UserErrorCode
  | AuthErrorCode
  | EventErrorCode
  | ProfileErrorCode
  | EmailErrorCode
  | GenericErrorCode;
