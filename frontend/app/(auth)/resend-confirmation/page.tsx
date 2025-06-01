'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabaseClient } from '@/stores/auth/clients';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { SupabaseErrorCode } from '@/constants/supabaseErrors';

const resendSchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es obligatorio')
    .trim(),
});

interface ResendFormData {
  email: string;
}

const ResendConfirmationPage = () => {
  const supabase = supabaseClient;

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResendFormData>({
    resolver: yupResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: data.email,
      });

      if (error) {
        const errorMessage = SupabaseErrorCode[error.code as keyof typeof SupabaseErrorCode] || error.message || 'Error desconocido al reenviar el correo.';
        toast.error('Error al reenviar', {
          description: errorMessage,
        });
      } else {
        toast.success('Correo reenviado', {
          description: 'Si existe una cuenta con este correo, se ha enviado un nuevo enlace de confirmación.',
        });
        reset();
      }
    } catch (err) {
      let descriptionMessage = 'Ocurrió un problema al intentar reenviar el correo.';
      if (err instanceof Error) {
        descriptionMessage = err.message;
      } else if (typeof err === 'object' && err !== null && Object.prototype.hasOwnProperty.call(err, 'message') && typeof (err as { message: unknown }).message === 'string') {
        descriptionMessage = (err as { message: string }).message;
      } else if (typeof err === 'string') {
        descriptionMessage = err;
      }
      toast.error('Error inesperado', {
        description: descriptionMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-800">
            Reenviar Email de Confirmación
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Ingresa tu correo electrónico para recibir un nuevo enlace de confirmación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-neutral-700">Correo Electrónico</Label>
              <Input 
                id="email"
                type="email"
                {...register('email')}
                placeholder="ejemplo@dominio.com"
                disabled={isLoading}
                className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                'Reenviar Email'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 

export default ResendConfirmationPage;