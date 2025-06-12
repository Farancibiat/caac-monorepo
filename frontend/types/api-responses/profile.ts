// Lo que devuelve la API cuando obtenemos el perfil
export interface ProfileApiData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string; // La API devuelve como string ISO
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  sexo: string;
  clubId: number | null;
}

// Datos de respuesta al actualizar perfil
export interface UpdateProfileResponseData {
  id: number;
  clubId: number | null;
} 