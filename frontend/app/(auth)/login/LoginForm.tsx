'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/auth/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { SupabaseErrorCode } from '@/constants/supabaseErrors'
import { useRouting } from '@/hooks/useRouting'
import { useAuthRedirect } from '@/stores/auth/hooks'

// Esquema de validación mejorado para el formulario de login
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es obligatorio')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Formato de email inválido'
    )
    .trim(),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
})

interface LoginFormData {
  email: string
  password: string
}

export const LoginForm = () => {
  const { signInWithGoogle, signInWithEmail, loading } = useAuthStore()
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const { redirect, routes } = useRouting();
  
  // Hook para manejar redirección automática después del login
  useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  })

  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsEmailLoading(true)
    try {
      await signInWithEmail(data.email, data.password)
      reset()
    } catch (error) {
      interface AppError {
        code?: string;
        message?: string;
      }
      const appError = error as AppError;
      const errorCode = appError?.code;

      const errorHandlers: Record<string, () => void> = {
        'email_not_confirmed': () => {
          toast.info(SupabaseErrorCode.email_not_confirmed, {
            description: 'Será redirigido para reenviar el email de confirmación.',
          });
          redirect(routes.AUTH.RESEND_CONFIRMATION);
        },
        // Add other specific error handlers here if needed
        // e.g., 'invalid_credentials': () => toast.error('Error de autenticación', { description: SupabaseErrorCode.invalid_credentials })
      };

      if (errorCode && errorHandlers[errorCode]) {
        errorHandlers[errorCode]();
      } else {
        // Default error handling
        let descriptionMessage = 'Error desconocido al iniciar sesión.';
        if (errorCode && SupabaseErrorCode[errorCode as keyof typeof SupabaseErrorCode]) {
          descriptionMessage = SupabaseErrorCode[errorCode as keyof typeof SupabaseErrorCode];
        } else if (appError?.message) {
          descriptionMessage = appError.message;
        } else if (error instanceof Error) {
          descriptionMessage = error.message;
        }

        toast.error('Error de autenticación', {
          description: descriptionMessage,
        });
      }
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulario de Email/Password */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-neutral-700">Correo Electrónico</Label>
          <Input 
            id="email"
            type="email"
            {...register('email')}
            placeholder="ejemplo@dominio.com"
            disabled={isEmailLoading}
            className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-neutral-700">Contraseña</Label>
            <Link 
              href={routes.AUTH.RECOVERY}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input 
            id="password"
            type="password"
            {...register('password')}
            placeholder="Ingrese su contraseña"
            disabled={isEmailLoading}
            className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>


        <Button 
          type="submit" 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
          disabled={isEmailLoading}
        >
          {isEmailLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-neutral-500">O continúa con</span>
        </div>
      </div>

      {/* Botón de Google */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="w-full h-12 text-base font-medium border-neutral-200 hover:bg-neutral-50"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2"></div>
        ) : (
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
      </Button>
    </div>
  )
} 