// Datos para login
export interface LoginFormData {
  email: string;
  password: string;
}

// Datos para registro
export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

// Datos para actualización de perfil básico (auth)
export interface AuthProfileUpdateData {
  name?: string;
  phone?: string;
} 