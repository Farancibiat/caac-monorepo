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
import { Mail, ArrowLeft } from 'lucide-react';
import { SupabaseErrorCode } from '@/constants/supabaseErrors';
import { ROUTES } from '@/constants/routes';

const recoverySchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es obligatorio')
    .trim(),
});

interface RecoveryFormData {
  email: string;
}

const PassRecoveryPage = () => {
  const supabase = supabaseClient;
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<RecoveryFormData>({
    resolver: yupResolver(recoverySchema),
  });

  const onSubmit = async (data: RecoveryFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}${ROUTES.AUTH.CALLBACK}?next=${encodeURIComponent(ROUTES.AUTH.RESET_PASSWORD)}`,
      });

      if (error) {
        const errorMessage = SupabaseErrorCode[error.code as keyof typeof SupabaseErrorCode] || 
                           error.message || 
                           'Error desconocido al enviar el correo de recuperación.';
        toast.error('Error al enviar correo', {
          description: errorMessage,
        });
      } else {
        setEmailSent(true);
        toast.success('Correo enviado', {
          description: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer tu contraseña.',
        });
        reset();
      }
    } catch (err) {
      let descriptionMessage = 'Ocurrió un problema al intentar enviar el correo de recuperación.';
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

  const handleTryAgain = () => {
    setEmailSent(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-primary-800">
              Correo Enviado
            </CardTitle>
            <CardDescription className="text-neutral-600">
              Hemos enviado un enlace de recuperación a tu correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-neutral-600">
                Si existe una cuenta con el correo <strong>{getValues('email')}</strong>, 
                recibirás un enlace para restablecer tu contraseña.
              </p>
              <div className="text-sm text-neutral-500 bg-neutral-50 p-3 rounded-md">
                <p className="font-medium mb-1">No olvides revisar:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Tu bandeja de entrada</li>
                  <li>La carpeta de spam o correo no deseado</li>
                  <li>El enlace expira en 1 hora</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleTryAgain}
                variant="outline" 
                className="w-full"
              >
                Enviar a otro correo
              </Button>
              
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button className="w-full bg-primary-600 hover:bg-primary-700">
                  Volver al Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-2 bg-club-gradient mx-auto rounded-full"></div>
          <CardTitle className="text-2xl text-primary-800 text-club-shadow">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Ingresa tu correo electrónico para recibir un enlace de recuperación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-neutral-700">
                Correo Electrónico
              </Label>
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
                'Enviar enlace de recuperación'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href={ROUTES.AUTH.LOGIN} 
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Iniciar Sesión
            </Link>
          </div>

          <div className="border-t border-neutral-200 pt-6 mt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-neutral-500">
                ¿No tienes una cuenta?{' '}
                <Link 
                  href={ROUTES.AUTH.REGISTER} 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PassRecoveryPage; 