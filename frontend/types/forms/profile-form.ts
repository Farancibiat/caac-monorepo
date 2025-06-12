// Datos del formulario de perfil
export interface ProfileFormData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: Date;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  sexo: 'masculino' | 'femenino' | 'otro';
  club: string; // Como string porque viene del combobox
}

// Props del componente ProfileForm
export interface ProfileFormProps {
  mode: 'registro' | 'edicion';
  userId?: string;
  onSuccess?: (data: ProfileFormData) => void;
} 