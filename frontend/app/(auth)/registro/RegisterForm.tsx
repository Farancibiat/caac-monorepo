'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouting } from '@/hooks/useRouting'
import { toast } from 'sonner'
import { AuthUser } from '@/stores/auth/types'

// Definición del esquema de validación con Yup
const registrationSchema = yup.object().shape({
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
  firstName: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .trim(),
  lastName: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras y espacios'
    )
    .trim()
})

// Tipos para los datos del formulario
interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export const RegisterForm: React.FC = () => {
  const { redirect, routes } = useRouting();
  const { signUp, signInWithGoogle } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registrationSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      // Preparar datos de usuario adicionales
      const userData: Partial<AuthUser> = {
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName
        }
      }

      // Registrar usuario
      await signUp(data.email, data.password, userData)

      // Mostrar mensaje de éxito con sonner
      toast.success('Registro exitoso. Por favor, verifica tu correo electrónico.', {
        description: 'Se ha enviado un correo de verificación.'
      })

      // Limpiar formulario
      reset()

      // Redirigir a página de verificación o login
      redirect(routes.AUTH.VERIFICATION)
    } catch (error) {
      // Manejar errores de registro
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Ocurrió un error durante el registro'
      
      // Mostrar mensaje de error con sonner
      toast.error('Error en el registro', {
        description: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
      // No necesitamos redirección aquí ya que signInWithGoogle lo maneja
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al registrarse con Google'
      
      toast.error('Error de registro con Google', {
        description: errorMessage
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-neutral-700">Nombre</Label>
            <Input 
              id="firstName"
              {...register('firstName')}
              placeholder="Ingrese su nombre"
              disabled={isSubmitting}
              className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-neutral-700">Apellido</Label>
            <Input 
              id="lastName"
              {...register('lastName')}
              placeholder="Ingrese su apellido"
              disabled={isSubmitting}
              className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-neutral-700">Correo Electrónico</Label>
            <Input 
              id="email"
              type="email"
              {...register('email')}
              placeholder="ejemplo@dominio.com"
              disabled={isSubmitting}
              className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-neutral-700">Contraseña</Label>
            <Input 
              id="password"
              type="password"
              {...register('password')}
              placeholder="Ingrese su contraseña"
              disabled={isSubmitting}
              className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-neutral-700">Confirmar Contraseña</Label>
            <Input 
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirme su contraseña"
              disabled={isSubmitting}
              className="mt-1 h-12 border-neutral-200 focus:border-primary-300 focus:ring-primary-200"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Registrando...
            </>
          ) : (
            'Registrarse'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-neutral-500">O regístrate con</span>
        </div>
      </div>

      <Button
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading}
        variant="outline"
        className="w-full h-12 text-base font-medium border-neutral-200 hover:bg-neutral-50"
      >
        {isGoogleLoading ? (
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
        {isGoogleLoading ? 'Registrando...' : 'Continuar con Google'}
      </Button>
    </div>
  )
} 