'use client';

import { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { SupabaseErrorCode } from '@/constants/supabaseErrors';
import { ROUTES } from '@/constants/routes';
import { useAuthRedirect } from '@/stores/auth/hooks';

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    )
    .required('La contraseña es obligatoria'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirme su contraseña'),
});

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const supabase = supabaseClient;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  // Hook para redirección automática cuando el usuario se autentica
  useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Verificar si hay una sesión válida para resetear contraseña
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.log('No valid session for password reset');
          setIsValidSession(false);
        } else {
          console.log('Valid session found for password reset');
          setIsValidSession(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsValidSession(false);
      }
    };

    checkSession();
  }, [supabase]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        const errorMessage = SupabaseErrorCode[error.code as keyof typeof SupabaseErrorCode] || 
                           error.message || 
                           'Error desconocido al restablecer la contraseña.';
        toast.error('Error al restablecer contraseña', {
          description: errorMessage,
        });
      } else {
        setPasswordReset(true);
        toast.success('Contraseña actualizada', {
          description: 'Tu contraseña ha sido restablecida exitosamente.',
        });
      }
    } catch (err) {
      let descriptionMessage = 'Ocurrió un problema al restablecer la contraseña.';
      if (err instanceof Error) {
        descriptionMessage = err.message;
      }
      toast.error('Error inesperado', {
        description: descriptionMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push(ROUTES.DASHBOARD);
  };

  // Loading state mientras verificamos la sesión
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-neutral-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // Sesión inválida
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl text-red-800">
              Enlace Inválido o Expirado
            </CardTitle>
            <CardDescription className="text-neutral-600">
              El enlace de recuperación no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-neutral-600">
                Por favor, solicita un nuevo enlace de recuperación.
              </p>
              <Button 
                onClick={() => router.push(ROUTES.AUTH.RECOVERY)}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                Solicitar nuevo enlace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Contraseña restablecida exitosamente
  if (passwordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              ¡Contraseña Restablecida!
            </CardTitle>
            <CardDescription className="text-neutral-600">
              Tu contraseña ha sido actualizada exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-neutral-600">
                Tu contraseña se ha actualizado correctamente y ya estás autenticado. 
                Puedes continuar usando la aplicación.
              </p>
              <Button 
                onClick={handleGoToDashboard}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulario para restablecer contraseña
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-2 bg-club-gradient mx-auto rounded-full"></div>
          <CardTitle className="text-2xl text-primary-800 text-club-shadow">
            Nueva Contraseña
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Ingresa tu nueva contraseña para completar el restablecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-neutral-700">
                Nueva Contraseña
              </Label>
              <div className="relative mt-1">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="Ingrese su nueva contraseña"
                  disabled={isLoading}
                  className="h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-neutral-700">
                Confirmar Nueva Contraseña
              </Label>
              <div className="relative mt-1">
                <Input 
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword')}
                  placeholder="Confirme su nueva contraseña"
                  disabled={isLoading}
                  className="h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
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
                  Restableciendo...
                </>
              ) : (
                'Restablecer Contraseña'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage; 