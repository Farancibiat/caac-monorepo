'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthStore } from '@/stores/auth/store';
import { supabaseClient } from '@/stores/auth/clients';
import { reqClient } from '@/lib/api-client';
import BirthPicker from '../ui/birthPicker';

// Define el esquema de validación con Yup
const profileSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio').min(2, 'El nombre debe tener al menos 2 caracteres'),
  primerApellido: yup.string().required('El primer apellido es obligatorio').min(2, 'El primer apellido debe tener al menos 2 caracteres'),
  segundoApellido: yup.string().required('El segundo apellido es obligatorio').min(2, 'El segundo apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: yup.date().required('La fecha de nacimiento es obligatoria').max(new Date(), 'La fecha de nacimiento no puede ser futura').typeError('Por favor, introduce una fecha válida'),
  telefono: yup.string().required('El teléfono es obligatorio').matches(/^[+]?[0-9\s-()]*$/, 'Formato de teléfono inválido'),
  direccion: yup.string().required('La dirección es obligatoria'),
  comuna: yup.string().required('La comuna es obligatoria'),
  region: yup.string().required('La región es obligatoria'),
  sexo: yup.string().required('El sexo es obligatorio').oneOf(['masculino', 'femenino', 'otro'], 'Selecciona un sexo válido'),
  club: yup.string().required('El club es obligatorio'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

// Tipo para la respuesta de la API del perfil
interface ProfileApiResponse {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string | Date;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  sexo: string;
  club?: string;
}

interface ProfileFormProps {
  mode: 'registro' | 'edicion';
  userId?: string;
  onSuccess?: (data: ProfileFormData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ mode, userId, onSuccess }) => {
  const { user, setUser } = useAuthStore();
  
  const form = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: undefined,
      telefono: '',
      direccion: '',
      comuna: '',
      region: '',
      sexo: '',
      club: undefined
    },
  });

  const { handleSubmit, control, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (mode === 'edicion') {
      const fetchProfileData = async () => {
        try {
          const response = await reqClient.get('/api/user/profile');
          
          if (!response.ok) {
            throw new Error(response.error || 'No se pudo cargar el perfil');
          }
          
          const data = response.data;
          // Convertir fechaNacimiento a Date si es string
          if (data && typeof data === 'object' && 'fechaNacimiento' in data && data.fechaNacimiento) {
            const profileData = data as ProfileApiResponse;
            if (typeof profileData.fechaNacimiento === 'string') {
              profileData.fechaNacimiento = new Date(profileData.fechaNacimiento);
            }
          }
          
          reset(data as ProfileFormData);
          toast.success('Datos del perfil cargados.');
        } catch (error) {
          let errorMessage = 'No se pudieron cargar los datos del perfil.';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        }
      };
      fetchProfileData();
    }
  }, [mode, reset, userId]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Paso 1: Guardar el perfil en la API
      const response = await reqClient.put('/api/user/profile', data);
      
      if (!response.ok) {
        throw new Error(response.error || 'Error al guardar el perfil');
      }
      
      // Paso 2: Si estamos en modo registro, marcar el perfil como completado en Supabase
      if (mode === 'registro' && user) {
        try {
          const { error: updateError } = await supabaseClient.auth.updateUser({
            data: {
              ...user.user_metadata,
              profileCompleted: true
            }
          });

          if (updateError) {
            throw new Error(`Error al marcar perfil como completado: ${updateError.message}`);
          }
          
          // Actualizar el estado local del usuario solo si la operación fue exitosa
          const updatedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              profileCompleted: true
            }
          };
          setUser(updatedUser);          
        } catch (metadataError) {
          // Mostrar error específico para el usuario
          const errorMessage = metadataError instanceof Error 
            ? metadataError.message 
            : 'Error al marcar el perfil como completado';
            
          toast.error(errorMessage, {
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            description: 'Los datos se guardaron pero hay un problema con el estado de completitud. Intenta nuevamente.'
          });
          
          // NO llamar onSuccess si hay error en metadata
          return;
        }
      }

      // Paso 3: Solo si llegamos aquí, todas las operaciones fueron exitosas
      toast.success('Perfil guardado con éxito!', {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        description: mode === 'registro' ? 'Tu registro ha sido completado exitosamente' : 'Los cambios se han guardado'
      });
      
      // Solo llamar onSuccess si TODO fue exitoso
      if (onSuccess) {
        onSuccess(data);
      }
      
    } catch (error: unknown) {
      
      // Determinar mensaje de error específico
      let errorMessage = 'Ocurrió un error al guardar el perfil';
      let description = 'Por favor, revisa los datos e intenta nuevamente';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Personalizar descripción según el tipo de error
        if (error.message.includes('network') || error.message.includes('fetch')) {
          description = 'Problema de conexión. Verifica tu internet e intenta nuevamente.';
        } else if (error.message.includes('validation')) {
          description = 'Algunos datos no son válidos. Revisa el formulario.';
        } else if (error.message.includes('Supabase') || error.message.includes('metadata')) {
          description = 'Error en la autenticación. Intenta cerrar sesión y volver a entrar.';
        }
      }
      
      // Mostrar error al usuario con descripción útil
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        description: description,
        duration: 6000 // Más tiempo para leer el error
      });
      
      // NO llamar onSuccess si hay cualquier error
      // El usuario permanece en la página para reintentar
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <FormField
            control={control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} autoComplete="given-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Primer Apellido */}
          <FormField
            control={control}
            name="primerApellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primer Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Tu primer apellido" {...field} autoComplete="family-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Segundo Apellido */}
          <FormField
            control={control}
            name="segundoApellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Tu segundo apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de Nacimiento */}
          <FormField
            control={control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <BirthPicker
                    startYear={1920}
                    endYear={new Date().getFullYear()}
                    selected={field.value || new Date()}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+56912345678" {...field} autoComplete="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección */}
          <FormField
            control={control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Calle Falsa 123, Depto 4B" {...field} autoComplete="street-address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comuna */}
          <FormField
            control={control}
            name="comuna"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comuna</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Providencia" {...field} autoComplete="address-level2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Región */}
          <FormField
            control={control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Región</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Metropolitana" {...field} autoComplete="address-level1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Sexo */}
          <FormField
            control={control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro / Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Club */}
          <FormField
            control={control}
            name="club"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nombre de tu club de natación" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center md:justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
          >
            {isSubmitting ? 'Guardando...' : (mode === 'registro' ? 'Completar Registro' : 'Guardar Cambios')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm; 