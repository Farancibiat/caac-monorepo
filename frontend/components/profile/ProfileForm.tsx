'use client';

import React, { useEffect } from 'react';
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
import { useClubs } from '@/hooks/useClubs';
import { useProfileData } from '@/hooks/useProfileData';
import { useRegionComuna } from '@/hooks/useRegionComuna';

import type { ProfileFormData, ProfileFormProps } from '@/types/forms/profile-form';

// Schema de validación optimizado
const profileSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio').min(2, 'El nombre debe tener al menos 2 caracteres'),
  primerApellido: yup.string().required('El primer apellido es obligatorio').min(2, 'El primer apellido debe tener al menos 2 caracteres'),
  segundoApellido: yup.string().required('El segundo apellido es obligatorio').min(2, 'El segundo apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: yup.date().required('La fecha de nacimiento es obligatoria').max(new Date(), 'La fecha de nacimiento no es válida').typeError('Por favor, introduce una fecha válida'),
  telefono: yup.string().required('El teléfono es obligatorio').matches(/^[+]?[0-9\s-()]*$/, 'Formato de teléfono inválido'),
  direccion: yup.string().required('La dirección es obligatoria'),
  comuna: yup.string().required('La comuna es obligatoria'),
  region: yup.string().required('La región es obligatoria'),
  sexo: yup.string().required('El sexo es obligatorio').oneOf(['masculino', 'femenino', 'otro'] as const, 'Selecciona un sexo válido'),
  club: yup.string().required('Debes seleccionar una opción para el club'),
});

type ProfileSchemaType = yup.InferType<typeof profileSchema>;

const ProfileForm: React.FC<ProfileFormProps> = ({ mode, onSuccess }) => {
  const { user, setUser } = useAuthStore();
  
  // Hooks especializados
  const { clubOptions, isLoading: isLoadingClubs, getClubIdByName, getClubNameById } = useClubs();

  const { 
    isLoading: isLoadingProfile, 
    loadProfile, 
    transformApiToForm, 
    transformFormToApi 
  } = useProfileData();  
  
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
  const selectedComuna = watch('comuna');
  

  const { regionOptions, comunaOptions, shouldResetComuna } = useRegionComuna(selectedRegion);


  useEffect(() => {
    if (selectedRegion && selectedComuna && shouldResetComuna(selectedComuna, selectedRegion)) {
      setValue('comuna', '');
    }
  }, [selectedRegion, selectedComuna, shouldResetComuna, setValue]);

  useEffect(() => {
    const loadAndSetProfile = async () => {
      if (mode === 'edicion' && !isLoadingClubs) {
      try {
        const {data} = await loadProfile();
        const formData = transformApiToForm(data, getClubNameById);
        reset(formData);
        toast.success('Datos del perfil cargados.');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el perfil';
        toast.error(errorMessage);
      }
    }
    };

    loadAndSetProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isLoadingClubs, loadProfile, transformApiToForm, reset]);

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      const submitData = transformFormToApi(data, getClubIdByName);
      
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
        }
      }
      
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        description,
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
                    placeholder={isLoadingClubs ? "Cargando clubs..." : "Selecciona tu club"}
                    searchPlaceholder="Buscar club..."
                    disabled={isLoadingClubs}
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
            disabled={isSubmitting || isLoadingProfile} 
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
          >
            {isSubmitting ? 'Guardando...' : 
             isLoadingProfile ? 'Cargando...' :
             (mode === 'registro' ? 'Completar Registro' : 'Guardar Cambios')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm; 