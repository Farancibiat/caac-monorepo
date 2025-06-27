# Contact Form Email Integration Guidelines

## 📋 **RESUMEN EJECUTIVO**

Esta guía detalla la implementación completa del sistema de contacto que conecta el formulario del frontend con la API para envío de emails usando Resend, sin requerir autenticación.

### **🎯 Objetivos**
1. Implementar validación robusta en `ContactForm.tsx` siguiendo el patrón de `LoginForm.tsx`
2. Crear endpoint público para envío de emails de contacto
3. Integrar servicio Resend existente para emails transaccionales
4. Mantener UX consistente con sistema de toast notifications

---

## **📋 CHECKLIST DE IMPLEMENTACIÓN**

### **FASE 1: FRONTEND - ACTUALIZAR CONTACTFORM** 🎨

#### **1.1 Instalar dependencias necesarias**
```bash
cd frontend
# Verificar que estas dependencias ya estén instaladas:
# react-hook-form, @hookform/resolvers, yup, sonner
```

#### **1.2 Crear schema de validación**
```typescript
// frontend/lib/contact-validation.ts - CREAR NUEVO ARCHIVO
import * as yup from 'yup'

export const contactSchema = yup.object().shape({
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

export interface ContactFormData {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}
```

#### **1.3 Actualizar ContactForm.tsx**
```typescript
// frontend/app/(public)/contacto/ContactForm.tsx - REEMPLAZAR COMPLETAMENTE
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { contactSchema, ContactFormData } from '@/lib/contact-validation'
import { apiClient } from '@/lib/api-client'

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
      await apiClient.post('/contact', data)
      
      toast.success('Mensaje enviado correctamente', {
        description: 'Te responderemos a la brevedad. ¡Gracias por contactarnos!',
      })
      
      reset()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || 'Error al enviar el mensaje'
      const errorDescription = error?.response?.data?.details || 'Por favor, intenta nuevamente más tarde.'
      
      toast.error(errorMessage, {
        description: errorDescription,
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
```

---

### **FASE 2: API - BACKEND IMPLEMENTATION** 🚀

**ESTADO ACTUAL:**
- 2.1 ✅ COMPLETADO - Schema de validación para contact creado
- 2.2 ✅ OK - emailService.ts actualizado 
- 2.3 ✅ COMPLETADO - Controlador agregado al emailController.ts existente
- 2.4 ✅ COMPLETADO - Ruta agregada a emailRoutes.ts existente
- 2.5 ✅ COMPLETADO - Constants/messages.ts actualizado
- 2.6 ✅ OK - index.ts ya incluye las rutas necesarias
- 2.7 ✅ COMPLETADO - schemas/index.ts actualizado
- 2.8 ✅ COMPLETADO - Rate limiter específico para contacto implementado

**RESUMEN DE IMPLEMENTACIÓN:**

✅ **Schema de Validación** (`api/src/schemas/contact.ts`):
- Validación robusta para nombre, email, teléfono opcional, asunto y mensaje
- Regex patterns para nombres (solo letras) y teléfonos
- Límites de caracteres apropiados
- Tipos TypeScript inferidos automáticamente

✅ **Controlador de Contacto** (`api/src/controllers/emailController.ts`):
- Función `sendContactMessage` agregada al controlador existente
- Endpoint público que no requiere autenticación
- Manejo de errores robusto
- Integración con el servicio de email existente

✅ **Rutas de Email** (`api/src/routes/emailRoutes.ts`):
- Ruta POST `/api/emails/contact` configurada
- Rate limiter específico aplicado (5 mensajes por hora por IP)
- Validación de datos con Zod
- Middleware de limpieza de strings vacíos

✅ **Mensajes de Respuesta** (`api/src/constants/messages.ts`):
- `CONTACT_MESSAGE_SENT` (200) - Éxito al enviar
- `CONTACT_INVALID_DATA` (400) - Datos inválidos  
- `RATE_LIMIT_CONTACT_EXCEEDED` (429) - Rate limit excedido
- `CONTACT_SEND_ERROR` (500) - Error interno

✅ **Rate Limiting Específico** (`api/src/middleware/rateLimitMiddleware.ts`):
- `contactLimiter`: 5 mensajes por hora por IP
- Identificación por IP + User-Agent para mayor seguridad
- Protección contra ataques DDoS
- Mensajes de error personalizados

✅ **Integración de Schemas** (`api/src/schemas/index.ts`):
- Exportación centralizada de contactSchemas
- Tipos TypeScript disponibles globalmente
- Integración con sistema de validación existente

**ENDPOINT DISPONIBLE:**
```
POST /api/emails/contact
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com", 
  "telefono": "+56912345678", // opcional
  "asunto": "Consulta sobre membresía",
  "mensaje": "Hola, me gustaría obtener información..."
}
```

**PROTECCIONES IMPLEMENTADAS:**
- ✅ Rate limiting: 5 mensajes/hora por IP
- ✅ Validación robusta de datos
- ✅ Sanitización de inputs
- ✅ Manejo de errores completo
- ✅ Logging de errores para debugging

**FASE 2 COMPLETADA** - El backend está listo para recibir mensajes de contacto desde el frontend.

---

### **FASE 3: CONFIGURACIÓN Y VARIABLES DE ENTORNO** ⚙️

#### **3.1 Actualizar variables de entorno**
```bash
# api/.env - AGREGAR:
CONTACT_EMAIL=contacto@aguasabiertaschiloe.cl
RESEND_FROM_EMAIL=noreply@aguasabiertaschiloe.cl
SITE_NAME=Club de Aguas Abiertas Chiloé
SITE_URL=https://aguasabiertaschiloe.cl

# Verificar que ya exista:
RESEND_API_KEY=re_xxxxxxxxxx
```

#### **3.2 Actualizar CORS si es necesario**
```typescript
// api/src/index.ts - Verificar que CORS incluya el dominio del frontend:
app.use(cors({
  origin: [
    'https://aguasabiertaschiloe.cl',
    'https://www.aguasabiertaschiloe.cl',
    'http://localhost:3000'  // Para desarrollo
  ],
  credentials: true
}));
```

---

### **FASE 4: TESTING Y VALIDACIÓN** ✅

#### **4.1 Testing Manual del Frontend**
```bash
# Verificar validaciones:
✅ Campo nombre: mínimo 2 caracteres, solo letras
✅ Campo email: formato válido requerido
✅ Campo teléfono: opcional, formato válido si se ingresa
✅ Campo asunto: mínimo 5 caracteres requerido
✅ Campo mensaje: mínimo 10 caracteres requerido
✅ Toast de éxito al enviar
✅ Toast de error en caso de fallo
✅ Reset del formulario después del envío exitoso
✅ Estados de loading durante envío
```

#### **4.2 Testing Manual de la API**
```bash
# Endpoint público de contacto:
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+56912345678",
    "asunto": "Consulta sobre membresía",
    "mensaje": "Hola, me gustaría obtener información sobre cómo unirme al club."
  }'

# Respuesta esperada:
{
  "success": true,
  "message": "Mensaje de contacto enviado correctamente"
}
```

#### **4.3 Testing de validaciones API**
```bash
# Probar datos inválidos:
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "A",
    "email": "invalid-email",
    "asunto": "Hi",
    "mensaje": "Short"
  }'

# Respuesta esperada: Error 400 con detalles de validación
```

#### **4.4 Verificar email recibido**
```
✅ Email llega a CONTACT_EMAIL
✅ Formato HTML correcto
✅ Información completa del contacto
✅ Enlaces de respuesta funcionan
✅ Diseño responsive en email
```

---

## **📝 CONSIDERACIONES ADICIONALES**

### **🔒 Seguridad**
- ✅ Rate limiting ya implementado en API
- ✅ Validación robusta en frontend y backend
- ✅ Sanitización de datos de entrada
- ✅ No exposición de información sensible

### **🎨 UX/UI**
- ✅ Consistencia con LoginForm.tsx
- ✅ Estados de loading claros
- ✅ Mensajes de error específicos
- ✅ Toast notifications informativos
- ✅ Reset automático del formulario

### **📧 Email**
- ✅ Template HTML responsive
- ✅ Información completa y organizada
- ✅ Enlaces de acción rápida
- ✅ Branding consistente

### **🔧 Mantenimiento**
- ✅ Código modular y reutilizable
- ✅ Esquemas de validación centralizados
- ✅ Manejo de errores robusto
- ✅ Logging apropiado

---

## **🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO**

1. **Backend primero** (Fases 2-3): Crear API endpoints y servicios
2. **Testing API**: Verificar funcionamiento con curl/Postman
3. **Frontend después** (Fase 1): Actualizar formulario con validaciones
4. **Testing integrado** (Fase 4): Verificar flujo completo
5. **Ajustes finales**: Pulir UX y mensajes

---

## **✅ CHECKLIST FINAL**

### **Frontend:**
- [ ] ✅ ContactForm.tsx actualizado con validaciones
- [ ] ✅ Schema de validación implementado
- [ ] ✅ Integración con react-hook-form
- [ ] ✅ Toast notifications funcionando
- [ ] ✅ Estados de loading implementados
- [ ] ✅ Reset automático del formulario

### **Backend:**
- [ ] ✅ Endpoint público `/api/contact` creado
- [ ] ✅ Validación de datos en backend
- [ ] ✅ Servicio de email actualizado
- [ ] ✅ Template HTML de email implementado
- [ ] ✅ Mensajes de respuesta apropiados
- [ ] ✅ Variables de entorno configuradas

### **Testing:**
- [ ] ✅ Validaciones frontend funcionando
- [ ] ✅ Endpoint API respondiendo correctamente
- [ ] ✅ Emails llegando correctamente
- [ ] ✅ Manejo de errores funcionando
- [ ] ✅ UX completa validada

**🎉 Una vez completado este checklist, el sistema de contacto estará completamente funcional y listo para producción.** 