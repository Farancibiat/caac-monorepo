# Registro de Usuario: Checklist de Implementación

Esta guía detalla las etapas y consideraciones necesarias para implementar un sistema de registro completo, abarcando tanto el frontend como el backend (API y Base de Datos).

## Frontend

1.  **Opciones de Registro:**
    *   [x] Implementar registro vía correo electrónico.
    *   [x] Implementar registro vía Google OAuth.
2.  **Validación de Email:**
    *   [x] Enviar correo de validación al usuario tras el registro vía email.
    *   [x] Bloquear el acceso a las secciones privadas del sitio si el email no ha sido validado.
    *   [x] Proveer un mecanismo para reenviar el correo de validación.
3.  **Formulario de Perfil Básico:**
    *   [x] Requerir la completitud de un formulario básico de perfil después del registro (tanto para email como para Google OAuth).
    *   [x] Bloquear el acceso a las secciones privadas del sitio si el formulario básico no ha sido completado.
4.  **Componente de Formulario Reutilizable:**
    *   [x] Desarrollar el formulario de perfil básico como un componente reutilizable.
    *   [x] Integrar el componente reutilizable en la sección de "Editar Perfil" para permitir la actualización de datos por parte del usuario.

## API

1.  **Integración con Supabase Auth:**
    *   [x] Configurar y habilitar los proveedores de autenticación deseados (Email, Google OAuth) en el dashboard de Supabase.
    *   [x] Integrar el SDK de Supabase en el frontend para manejar los flujos de registro, inicio de sesión, cierre de sesión y validación de email.
    *   [ ] Configurar las plantillas de correo electrónico (verificación de email, restablecimiento de contraseña) en Supabase.
    *   [ ] Asegurar que los endpoints de la API personalizada estén protegidos, validando los JWT de Supabase.
2.  **Endpoints para Gestión de Perfil:**
    *   [ ] Crear/actualizar endpoint `/users/me/profile` (PUT/PATCH) para que el usuario pueda completar/actualizar su perfil básico. Este endpoint interactuará con tu tabla de perfiles personalizada, la cual puede estar vinculada al `auth.users` de Supabase.
    *   [ ] Asegurar que este endpoint solo sea accesible por usuarios autenticados.
    *   [ ] Modificar endpoints existentes para incluir el campo `profileCompleted` en las respuestas del usuario.
    *   [ ] Crear endpoint `GET /users/me/profile-status` para verificar el estado de completitud del perfil del usuario autenticado.
    *   [ ] Actualizar endpoint `PUT /users/me/profile` para marcar automáticamente `profileCompleted: true` cuando se complete exitosamente el formulario básico.

## Base de Datos (Prisma)

1.  **Sincronización del Esquema con Supabase (Introspección):**
    *   [ ] Si Supabase Auth ha modificado la estructura de la base de datos (e.g., tablas `auth.users`, `auth.schemas`, etc.), actualizar el `schema.prisma` local para reflejar estos cambios.
    *   [ ] **Comando:** `npx prisma db pull` (Esto introspectará la base de datos y actualizará tu `schema.prisma`).
    *   [ ] Revisar los cambios en `schema.prisma` después de la introspección para asegurar que son los esperados.
2.  **Actualización de Tabla `User` (o `Profiles`):**
    *   [ ] Añadir campo `emailVerified` (Boolean) a la tabla de perfiles de usuario (si no es manejado automáticamente por Supabase Auth en una tabla accesible/relacionada por Prisma de forma directa para tu lógica de negocio). Considerar si este estado ya está disponible a través de las tablas de Supabase Auth y si necesitas duplicarlo.
    *   [ ] **CRÍTICO**: Añadir campo `profileCompleted` (Boolean) a la tabla de perfiles de usuario para rastrear si el usuario ha completado el formulario de perfil básico por primera vez. Definir valor por defecto en `false`.
    *   [ ] Asegurar que la tabla de perfiles tenga una relación clara con la tabla `auth.users` de Supabase (generalmente mediante un `userId` que coincida con el `id` del usuario en Supabase).
    *   [ ] **NUEVO**: Crear trigger o función para sincronizar el campo `profileCompleted` con Supabase `user_metadata.profileCompleted` si es necesario para consultas directas.
3.  **Generación y Migraciones:**
    *   [ ] Después de cualquier cambio manual en `schema.prisma` (como añadir `profileCompleted`) o después de `db pull` si es necesario ajustar modelos, generar el cliente de Prisma.
    *   [ ] **Comando:** `npx prisma generate`
    *   [ ] Si se han realizado cambios en el esquema que no fueron producto de la introspección (ej. añadir campos a tu tabla de perfiles), crear y aplicar las migraciones correspondientes.
    *   [ ] **Comandos:** `npx prisma migrate dev --name add_profile_completed_field` (para desarrollo) o `npx prisma migrate deploy` (para producción).

## Supabase Configuración

1.  **User Metadata Management:**
    *   [ ] **CRÍTICO**: Configurar Supabase para manejar el campo `profileCompleted` en `user_metadata` por defecto como `false` para nuevos usuarios.
    *   [ ] Implementar trigger o función en Supabase que inicialice `user_metadata.profileCompleted = false` al crear un nuevo usuario.
    *   [ ] Verificar que las reglas de RLS (Row Level Security) permitan a los usuarios actualizar su propio `user_metadata.profileCompleted`.
2.  **Database Functions (Opcional):**
    *   [ ] Crear función de base de datos para sincronizar el estado `profileCompleted` entre `auth.users.user_metadata` y la tabla de perfiles personalizada.
    *   [ ] Implementar trigger automático que actualice ambas ubicaciones cuando se modifique el estado de completitud del perfil.

## Tareas de Validación y Testing

1.  **Flujo de Registro Completo:**
    *   [ ] Verificar que usuarios nuevos vía email tengan `profileCompleted: false` por defecto.
    *   [ ] Verificar que usuarios nuevos vía Google OAuth tengan `profileCompleted: false` por defecto.
    *   [ ] Probar que el middleware redirija correctamente a `/complete-profile` cuando `profileCompleted: false`.
    *   [ ] Verificar que al completar el formulario se actualice `profileCompleted: true` tanto en Supabase como en el estado local.
    *   [ ] Probar que usuarios con `profileCompleted: true` puedan acceder normalmente a rutas privadas.
2.  **Casos Edge:**
    *   [ ] Verificar comportamiento cuando el usuario cierra la sesión sin completar el perfil.
    *   [ ] Probar que usuarios que ya tenían perfil completo antes de esta implementación no sean afectados.
    *   [ ] Verificar sincronización entre diferentes pestañas/dispositivos del mismo usuario.

## Consideraciones Adicionales

*   **Seguridad:**
    *   [x] Asegurar el correcto hasheo de contraseñas.
    *   [ ] Implementar medidas contra ataques comunes (CSRF, XSS).
    *   [ ] Validar y sanitizar todas las entradas del usuario.
    *   [ ] Configurar headers de seguridad (X-Frame-Options, CSP, etc.).
    *   [ ] Implementar rate limiting en API endpoints.
*   **Manejo de Errores:**
    *   [x] Proveer mensajes de error claros y útiles tanto en el frontend como en las respuestas de la API.
*   **UX/UI:**
    *   [x] Asegurar un flujo de registro intuitivo y amigable.
    *   [x] Proveer feedback visual durante las operaciones (e.g., spinners de carga).
    *   [x] Implementar página `/complete-profile` con diseño atractivo y explicaciones claras sobre por qué se requiere la información.

### **Medidas de Seguridad Pendientes por Implementar:**

#### **1. Headers de Seguridad:**
```javascript
// frontend/next.config.mjs - AGREGAR
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ],
      },
    ]
  },
}
```

#### **2. Sanitización de Inputs:**
```bash
# INSTALAR
npm install dompurify xss validator
npm install --save-dev @types/dompurify
```

```typescript
// lib/security.ts - CREAR
import DOMPurify from 'dompurify';
import validator from 'validator';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(validator.escape(input));
};

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html);
};
```

#### **3. Rate Limiting en API:**
```bash
# INSTALAR EN API
npm install express-rate-limit helmet
```

```typescript
// api/src/middleware/security.ts - CREAR
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite cada IP a 100 requests por windowMs
  message: 'Demasiadas peticiones, intenta de nuevo más tarde',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos  
  max: 5, // limite endpoints de auth a 5 intentos
  message: 'Demasiados intentos de login, intenta de nuevo más tarde',
});
```

## Estado Actual (Frontend Completado)

### ✅ **Implementado en Frontend:**

1. **Tipos y Estado:**
   - Agregado campo `profileCompleted?: boolean` al tipo `AuthUser`
   - Estado de completitud del perfil manejado en el store de autenticación

2. **Hooks de Verificación:**
   - Nuevo hook `useProfileCompletionCheck()` para verificar y redirigir usuarios con perfil incompleto
   - Integración en hooks existentes para redirección automática

3. **Middleware Actualizado:**
   - Verificación de `user_metadata.profileCompleted` en rutas protegidas
   - Redirección automática a `/complete-profile` cuando `profileCompleted === false`
   - Exclusión de la ruta `/complete-profile` de esta verificación

4. **Componentes:**
   - `ProfileForm` actualizado para marcar `profileCompleted: true` al completar en modo "registro"
   - Página `/complete-profile` rediseñada con mejor UX y validaciones
   - Dashboard actualizado para mostrar estado de completitud del perfil

5. **Flujo de Usuario:**
   - Redirección automática desde cualquier ruta privada si el perfil no está completo
   - Actualización automática de `user_metadata` en Supabase al completar el formulario
   - Sincronización del estado local con Supabase

### 🔄 **Pendiente en Backend/Supabase:**

La implementación de frontend está completa y funcional. Las tareas pendientes se enfocan en:
- Configurar valores por defecto en Supabase para nuevos usuarios
- Crear endpoints backend para manejar perfiles
- Sincronizar datos entre Supabase Auth y base de datos personalizada
- Implementar triggers y funciones de base de datos 