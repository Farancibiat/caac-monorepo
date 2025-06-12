'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
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
import { 
  getRegiones, 
  getComunasByRegion, 
  isValidComunaForRegion 
} from '@/lib/regiones-comunas-helper';

import type { ProfileFormData, ProfileFormProps } from '@/types/forms/profile-form';
import type { ProfileApiData } from '@/types/api-responses/profile';
import type { ClubSimple } from '@/types/models/club';
import type { ApiResponse } from '@/types/api';

const profileSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio').min(2, 'El nombre debe tener al menos 2 caracteres'),
  primerApellido: yup.string().required('El primer apellido es obligatorio').min(2, 'El primer apellido debe tener al menos 2 caracteres'),
  segundoApellido: yup.string().required('El segundo apellido es obligatorio').min(2, 'El segundo apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: yup.date().required('La fecha de nacimiento es obligatoria').max(new Date(), 'La fecha de nacimiento no puede ser futura').typeError('Por favor, introduce una fecha válida'),
  telefono: yup.string().required('El teléfono es obligatorio').matches(/^[+]?[0-9\s-()]*$/, 'Formato de teléfono inválido'),
  direccion: yup.string().required('La dirección es obligatoria'),
  comuna: yup.string()
    .required('La comuna es obligatoria')
    .test('comuna-matches-region', 'La comuna debe corresponder a la región seleccionada', 
      function(value) {
        const { region } = this.parent;
        return value && region ? isValidComunaForRegion(value, region) : true;
      }
    ),
  region: yup.string()
    .required('La región es obligatoria')
    .oneOf(getRegiones(), 'Selecciona una región válida'),
  sexo: yup.string().required('El sexo es obligatorio').oneOf(['masculino', 'femenino', 'otro'] as const, 'Selecciona un sexo válido'),
  club: yup.string().required('Debes seleccionar una opción para el club'),
});

type ProfileSchemaType = yup.InferType<typeof profileSchema>;

const ProfileForm: React.FC<ProfileFormProps> = ({ mode, userId, onSuccess }) => {
  const { user, setUser } = useAuthStore();
  
  const form = useForm<ProfileSchemaType>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: new Date(),
      telefono: '',
      direccion: '',
      comuna: '',
      region: '',
      sexo: 'masculino',
      club: ''
    },
  });

  const { handleSubmit, control, reset, formState: { isSubmitting }, watch, setValue } = form;

  const selectedRegion = watch('region');
  
  const [clubs, setClubes] = useState<ClubSimple[]>([]);
  const [isLoadingClubes, setIsLoadingClubes] = useState(true);
  
  const regionOptions = getRegiones();
  const comunaOptions = selectedRegion ? getComunasByRegion(selectedRegion) : [];
  
  const clubOptions = clubs.length > 0 
    ? clubs.map(club => club.nombre)
    : ['Sin Club', 'Otro'];
  
  useEffect(() => {
    const fetchClubes = async () => {
      try {
        setIsLoadingClubes(true);
        const response = await reqClient.get('/api/clubes');
        
        if (response.ok && response.data) {
          const clubsResponse = response.data as ApiResponse<ClubSimple[]>;
          if (clubsResponse.data) {
            setClubes(clubsResponse.data);
          }
        } else {
          setClubes([]);
        }
      } catch (error) {
        console.error('Error al cargar clubs:', error);
        setClubes([]);
      } finally {
        setIsLoadingClubes(false);
      }
    };

    fetchClubes();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const currentComuna = watch('comuna');
      if (currentComuna && !isValidComunaForRegion(currentComuna, selectedRegion)) {
        setValue('comuna', '');
      }
    } else {
      setValue('comuna', '');
    }
  }, [selectedRegion, setValue, watch]);

  useEffect(() => {
    if (mode === 'edicion' && clubs.length > 0) {
      const fetchProfileData = async () => {
        try {
          const response = await reqClient.get('/api/user/profile');
          
          if (!response.ok) {
            throw new Error(response.error || 'No se pudo cargar el perfil');
          }
          
          const profileData = response.data as ProfileApiData;
          
          // Convertir clubId a nombre del club para el formulario
          const clubName = profileData.clubId 
            ? clubs.find(club => club.id === profileData.clubId)?.nombre || ''
            : '';
          
          const formData: ProfileSchemaType = {
            nombre: profileData.nombre,
            primerApellido: profileData.primerApellido,
            segundoApellido: profileData.segundoApellido,
            fechaNacimiento: new Date(profileData.fechaNacimiento),
            telefono: profileData.telefono,
            direccion: profileData.direccion,
            comuna: profileData.comuna,
            region: profileData.region,
            sexo: profileData.sexo as 'masculino' | 'femenino' | 'otro',
            club: clubName
          };
          
          reset(formData);
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
  }, [mode, reset, userId, clubs]);

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      let clubId: number | null = null;
      if (data.club) {
        const selectedClub = clubs.find(club => club.nombre === data.club);
        clubId = selectedClub ? selectedClub.id : null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { club, ...restData } = data;
      const submitData = {
        ...restData,
        fechaNacimiento: data.fechaNacimiento,
        sexo: data.sexo,
        clubId
      };

      const response = await reqClient.put('/api/user/profile', submitData);
      
      if (!response.ok) {
        throw new Error(response.error || 'Error al guardar el perfil');
      }
      
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
          
          const updatedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              profileCompleted: true
            }
          };
          setUser(updatedUser);          
        } catch (metadataError) {
          const errorMessage = metadataError instanceof Error 
            ? metadataError.message 
            : 'Error al marcar el perfil como completado';
            
          toast.error(errorMessage, {
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            description: 'Los datos se guardaron pero hay un problema con el estado de completitud. Intenta nuevamente.'
          });
          
          return;
        }
      }

      toast.success('Perfil guardado con éxito!', {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        description: mode === 'registro' ? 'Tu registro ha sido completado exitosamente' : 'Los cambios se han guardado'
      });
      
      if (onSuccess) {
        onSuccess(data as ProfileFormData);
      }
      
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error al guardar el perfil';
      let description = 'Por favor, revisa los datos e intenta nuevamente';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
          description = 'Problema de conexión. Verifica tu internet e intenta nuevamente.';
        } else if (error.message.includes('validation')) {
          description = 'Algunos datos no son válidos. Revisa el formulario.';
        } else if (error.message.includes('Supabase') || error.message.includes('metadata')) {
          description = 'Error en la autenticación. Intenta cerrar sesión y volver a entrar.';
        }
      }
      
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        description: description,
        duration: 6000
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <FormField
            control={control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Región</FormLabel>
                <FormControl>
                  <Combobox
                    options={regionOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecciona tu región"
                    searchPlaceholder="Buscar región..."
                    emptyText="No se encontraron regiones."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="comuna"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comuna</FormLabel>
                <FormControl>
                  <Combobox
                    options={comunaOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecciona tu comuna"
                    searchPlaceholder="Buscar comuna..."
                    disabled={!selectedRegion}
                    emptyText={!selectedRegion ? "Primero selecciona una región" : "No se encontraron comunas."}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={control}
            name="club"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club</FormLabel>
                <FormControl>
                  <Combobox
                    options={clubOptions}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder={isLoadingClubes ? "Cargando clubs..." : "Selecciona tu club"}
                    searchPlaceholder="Buscar club..."
                    disabled={isLoadingClubes}
                    emptyText="No se encontraron clubs."
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