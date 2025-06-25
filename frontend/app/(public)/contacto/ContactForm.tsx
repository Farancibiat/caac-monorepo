'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import * as yup from 'yup'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { reqClient } from '@/lib/api-client'

interface ApiError {
  error?: string
  status: number
}
interface ContactFormData {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}

const contactSchema: yup.ObjectSchema<ContactFormData> = yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios')
    .trim(),
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es obligatorio')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Formato de email inválido'
    )
    .trim(),
  telefono: yup
    .string()
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Formato de teléfono inválido')
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(15, 'El teléfono no puede exceder 15 caracteres'),
  asunto: yup
    .string()
    .required('El asunto es obligatorio')
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(100, 'El asunto no puede exceder 100 caracteres')
    .trim(),
  mensaje: yup
    .string()
    .required('El mensaje es obligatorio')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .trim(),
}) 

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await reqClient.post('/api/contact', data, { requireAuth: false })
      
      if (!response.ok) {
        throw new Error(response.error || 'Error al enviar el mensaje')
      }
      
      toast.success('Mensaje enviado correctamente', {
        description: 'Te responderemos a la brevedad. ¡Gracias por contactarnos!',
      })
      
      reset()
    } catch (error: unknown) {
      const apiError = error as ApiError
      const errorMessage = apiError?.error || 'Error al enviar el mensaje'
      
      toast.error(errorMessage, {
        description: 'Por favor, intenta nuevamente más tarde.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-primary-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary-800 flex items-center">
          <Send className="h-6 w-6 mr-3 text-primary-600" />
          Envíanos un Mensaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-neutral-700 font-medium">
                Nombre *
              </Label>
              <Input
                id="nombre"
                type="text"
                {...register('nombre')}
                placeholder="Tu nombre completo"
                disabled={isSubmitting}
                className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700 font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="tu@email.com"
                disabled={isSubmitting}
                className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-neutral-700 font-medium">
              Teléfono
            </Label>
            <Input
              id="telefono"
              type="tel"
              {...register('telefono')}
              placeholder="+56 9 1234 5678"
              disabled={isSubmitting}
              className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="asunto" className="text-neutral-700 font-medium">
              Asunto *
            </Label>
            <Input
              id="asunto"
              type="text"
              {...register('asunto')}
              placeholder="¿En qué podemos ayudarte?"
              disabled={isSubmitting}
              className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.asunto && (
              <p className="text-red-500 text-sm mt-1">
                {errors.asunto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensaje" className="text-neutral-700 font-medium">
              Mensaje *
            </Label>
            <Textarea
              id="mensaje"
              {...register('mensaje')}
              placeholder="Escribe tu mensaje aquí..."
              rows={6}
              disabled={isSubmitting}
              className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
            />
            {errors.mensaje && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mensaje.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando mensaje...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default ContactForm 