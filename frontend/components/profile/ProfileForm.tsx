import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  FormDescription,
} from '@/components/ui/form';
import { cn } from '@/lib/shadcn-util';

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

interface ProfileFormProps {
  mode: 'registro' | 'edicion';
  userId?: string;
  onSuccess?: (data: ProfileFormData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ mode, userId, onSuccess }) => {
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
          // TODO: Reemplazar fetch por fetchAPI
          const res = await fetch('/api/user/profile');
          if (!res.ok) throw new Error('No se pudo cargar el perfil');
          const data = await res.json();
          // Convertir fechaNacimiento a Date si es string
          if (data.fechaNacimiento) {
            data.fechaNacimiento = new Date(data.fechaNacimiento);
          }
          reset(data);
          toast.success('Datos del perfil cargados.');
        } catch (error) {
          console.error("Error fetching profile data:", error);
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
        // TODO: Reemplazar fetch por fetchAPI
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('No se pudo guardar el perfil');
      toast.success('Perfil guardado con éxito!', {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />, 
      });
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      let errorMessage = 'Ocurrió un error al guardar.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />, 
      });
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
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
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
                <FormLabel>Club (Opcional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nombre de tu club de natación" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormDescription>
                  Si perteneces a algún club, indícalo aquí.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? 'Guardando...' : (mode === 'registro' ? 'Completar Registro' : 'Guardar Cambios')}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm; 