// Estructura completa del club
export interface Club {
  id: number;
  nombre: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Club simplificado para listas y combobox
export type ClubSimple = Pick<Club, 'id' | 'nombre'>;