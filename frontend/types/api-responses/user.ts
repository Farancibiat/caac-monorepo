import type { User } from '@/types/models/user';

// Usuario con reservas incluidas
export interface UserWithReservations extends User {
  reservations: unknown[]; // Se puede tipear más específicamente si es necesario
} 