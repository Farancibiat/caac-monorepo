import { ServiceErrorCode } from './MessageTypes';

/**
 * Wrapper estándar para resultados de servicios con tipado estricto
 * Permite manejo consistente de éxito/error en toda la aplicación
 */
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: ServiceErrorCode; // ← Tipado estricto para codes de error
}

/**
 * Helpers para crear ServiceResult de forma consistente
 */
export const ServiceResultHelper = {
  success: <T>(data?: T): ServiceResult<T> => ({
    success: true,
    ...(data !== undefined && { data })
  }),

  error: <T>(errorCode: ServiceErrorCode, error?: string): ServiceResult<T> => ({
    success: false,
    errorCode,
    ...(error !== undefined && { error })
  })
} as const;
