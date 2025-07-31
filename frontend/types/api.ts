
export interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Utilidades para manejar errores y respuestas exitosas
export type ApiError = Pick<ApiResponse, 'error' | 'message' | 'status' | 'ok'>;
export type ApiSuccess<T> = Required<Pick<ApiResponse<T>, 'data' | 'ok'>> & 
  Pick<ApiResponse<T>, 'message' | 'status'>; 