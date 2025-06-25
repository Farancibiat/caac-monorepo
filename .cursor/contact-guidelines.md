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

#### **2.1 Crear schema de validación para contact**
```typescript
// api/src/schemas/contact.ts - CREAR NUEVO ARCHIVO
import { z } from 'zod';

export const contactSchemas = {
  // Schema para envío de mensaje de contacto
  sendMessage: z.object({
    nombre: z.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios')
      .trim(),
    email: z.string()
      .email('Formato de email inválido')
      .max(255, 'Email muy largo'),
    telefono: z.string()
      .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de teléfono inválido')
      .min(8, 'Teléfono debe tener al menos 8 dígitos')
      .max(15, 'Teléfono muy largo')
      .optional(),
    asunto: z.string()
      .min(5, 'El asunto debe tener al menos 5 caracteres')
      .max(100, 'El asunto no puede exceder 100 caracteres')
      .trim(),
    mensaje: z.string()
      .min(10, 'El mensaje debe tener al menos 10 caracteres')
      .max(1000, 'El mensaje no puede exceder 1000 caracteres')
      .trim(),
  }),
};

// Tipos inferidos
export type SendContactMessageData = z.infer<typeof contactSchemas.sendMessage>;
```

#### **2.2 Actualizar emailService.ts**
```typescript
// api/src/services/emailService.ts - AGREGAR al final de EmailTemplates class:

// Email de contacto (nuevo)
static contactMessage(contactData: any): EmailTemplate {
  return {
    to: process.env.CONTACT_EMAIL || 'contacto@aguasabiertaschiloe.cl',
    subject: `Nuevo mensaje de contacto: ${contactData.asunto}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo Mensaje de Contacto</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #0066cc;">
            <h1 style="color: #0066cc; margin: 0;">${SITE_NAME}</h1>
            <p style="color: #666; margin: 5px 0;">Nuevo Mensaje de Contacto</p>
          </div>

          <!-- Contact Details -->
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Información del Contacto</h2>
            
            <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #0066cc;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 30%;">Nombre:</td>
                  <td style="padding: 8px 0;">${contactData.nombre}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${contactData.email}" style="color: #0066cc;">${contactData.email}</a>
                  </td>
                </tr>
                ${contactData.telefono ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Teléfono:</td>
                  <td style="padding: 8px 0;">
                    <a href="tel:${contactData.telefono}" style="color: #0066cc;">${contactData.telefono}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Asunto:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #0066cc;">${contactData.asunto}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Fecha:</td>
                  <td style="padding: 8px 0;">${new Date().toLocaleDateString('es-CL', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
              </table>
            </div>

            <!-- Message Content -->
            <div style="background: white; padding: 20px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #28a745;">Mensaje:</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap; line-height: 1.6;">
${contactData.mensaje}
              </div>
            </div>

            <!-- Quick Actions -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${contactData.email}?subject=Re: ${contactData.asunto}" 
                 style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
                Responder por Email
              </a>
              ${contactData.telefono ? `
              <a href="tel:${contactData.telefono}" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Llamar
              </a>
              ` : ''}
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de ${SITE_NAME}</p>
            <p>© ${new Date().getFullYear()} ${SITE_NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Agregar también al final de la clase EmailService:
static async sendContactMessage(contactData: any): Promise<boolean> {
  const template = EmailTemplates.contactMessage(contactData);
  return this.sendEmail(template);
}
```

#### **2.3 Crear contactController.ts**
```typescript
// api/src/controllers/contactController.ts - CREAR NUEVO ARCHIVO
import { Request, Response } from 'express';
import { EmailService } from '../services/emailService';
import { sendMessage } from '../utils/responseHelper';
import { SendContactMessageData } from '../schemas/contact';

// Enviar mensaje de contacto (endpoint público)
export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData: SendContactMessageData = req.body;

    // Enviar email al equipo del club
    const emailSent = await EmailService.sendContactMessage(contactData);

    if (!emailSent) {
      sendMessage(res, 'EMAIL_SEND_ERROR');
      return;
    }

    sendMessage(res, 'CONTACT_MESSAGE_SENT');
  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    sendMessage(res, 'EMAIL_SEND_ERROR');
  }
};

// Verificar configuración de emails (endpoint público para debugging)
export const testEmailConfiguration = async (_req: Request, res: Response): Promise<void> => {
  try {
    const isConfigured = await EmailService.testConfiguration();
    
    if (isConfigured) {
      sendMessage(res, 'EMAIL_CONFIG_VALID');
    } else {
      sendMessage(res, 'EMAIL_CONFIG_INVALID');
    }
  } catch (error) {
    console.error('Error al verificar configuración de email:', error);
    sendMessage(res, 'EMAIL_CONFIG_ERROR');
  }
};
```

#### **2.4 Crear contactRoutes.ts**
```typescript
// api/src/routes/contactRoutes.ts - CREAR NUEVO ARCHIVO
import express, { Router } from 'express';
import { sendContactMessage, testEmailConfiguration } from '@/controllers/contactController';
import { validateBody, cleanEmptyStrings } from '@/middleware/validationMiddleware';
import { contactSchemas } from '@/schemas/contact';

const router: Router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post('/', 
  cleanEmptyStrings, 
  validateBody(contactSchemas.sendMessage), 
  sendContactMessage
);

router.get('/test-config', testEmailConfiguration);

export default router;
```

#### **2.5 Actualizar constants/messages.ts**
```typescript
// api/src/constants/messages.ts - AGREGAR:
200: {
  // ... mensajes existentes ...
  CONTACT_MESSAGE_SENT: 'Mensaje de contacto enviado correctamente',
},

400: {
  // ... mensajes existentes ...
  CONTACT_INVALID_DATA: 'Los datos del formulario de contacto son inválidos',
},

500: {
  // ... mensajes existentes ...
  CONTACT_SEND_ERROR: 'Error al enviar mensaje de contacto',
}
```

#### **2.6 Actualizar index.ts para incluir rutas**
```typescript
// api/src/index.ts - AGREGAR:
import contactRoutes from '@/routes/contactRoutes';

// En la sección de rutas, agregar:
app.use('/api/contact', contactRoutes);
```

#### **2.7 Actualizar schemas/index.ts**
```typescript
// api/src/schemas/index.ts - AGREGAR:
export * from './contact';

// En el objeto schemas:
import { contactSchemas } from './contact';

export const schemas = {
  auth: authSchemas,
  user: userSchemas,
  reservation: reservationSchemas,
  contact: contactSchemas,  // ⭐ NUEVO
} as const;
```

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