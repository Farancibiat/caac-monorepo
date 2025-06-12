// Modelo base de usuario como lo maneja el frontend
export interface User {
  id: number;
  auth_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'USER' | 'ADMIN' | 'TREASURER';
  isActive: boolean;
  avatar_url: string | null;
  provider: string;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Estado del perfil para verificaciones (lo que devuelve checkProfileStatus)
export interface ProfileStatus {
  profileCompleted: boolean;
  missingFields: {
    name: boolean;
    phone: boolean;
  };
} 