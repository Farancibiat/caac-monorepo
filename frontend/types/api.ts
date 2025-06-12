// Estructura base para todas las respuestas de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  details?: string;
}

// Utilidades para manejar errores y respuestas exitosas
export type ApiError = Pick<ApiResponse, 'success' | 'error' | 'message' | 'details'>;
export type ApiSuccess<T> = Required<Pick<ApiResponse<T>, 'success' | 'data'>> & 
  Pick<ApiResponse<T>, 'message'>; 