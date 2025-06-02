# Registro de Usuario: Checklist de Implementación

Esta guía detalla las etapas y consideraciones necesarias para implementar un sistema de registro completo, abarcando tanto el frontend como el backend (API y Base de Datos).

## Frontend

1.  **Opciones de Registro:**
    *   [x] Implementar registro vía correo electrónico.
    *   [x] Implementar registro vía Google OAuth.
2.  **Validación de Email:**
    *   [x] Enviar correo de validación al usuario tras el registro vía email.
    *   [x] Bloquear el acceso a las secciones privadas del sitio si el email no ha sido validado.
    *   [ ] Proveer un mecanismo para reenviar el correo de validación.
3.  **Formulario de Perfil Básico:**
    *   [ ] Requerir la completitud de un formulario básico de perfil después del registro (tanto para email como para Google OAuth).
    *   [ ] Bloquear el acceso a las secciones privadas del sitio si el formulario básico no ha sido completado.
4.  **Componente de Formulario Reutilizable:**
    *   [ ] Desarrollar el formulario de perfil básico como un componente reutilizable.
    *   [ ] Integrar el componente reutilizable en la sección de "Editar Perfil" para permitir la actualización de datos por parte del usuario.

## API

1.  **Integración con Supabase Auth:**
    *   [x] Configurar y habilitar los proveedores de autenticación deseados (Email, Google OAuth) en el dashboard de Supabase.
    *   [x] Integrar el SDK de Supabase en el frontend para manejar los flujos de registro, inicio de sesión, cierre de sesión y validación de email.
    *   [ ] Configurar las plantillas de correo electrónico (verificación de email, restablecimiento de contraseña) en Supabase.
    *   [ ] Asegurar que los endpoints de la API personalizada estén protegidos, validando los JWT de Supabase.
2.  **Endpoints para Gestión de Perfil:**
    *   [ ] Crear/actualizar endpoint `/users/me/profile` (PUT/PATCH) para que el usuario pueda completar/actualizar su perfil básico. Este endpoint interactuará con tu tabla de perfiles personalizada, la cual puede estar vinculada al `auth.users` de Supabase.
    *   [ ] Asegurar que este endpoint solo sea accesible por usuarios autenticados.

## Base de Datos (Prisma)

1.  **Sincronización del Esquema con Supabase (Introspección):**
    *   [ ] Si Supabase Auth ha modificado la estructura de la base de datos (e.g., tablas `auth.users`, `auth.schemas`, etc.), actualizar el `schema.prisma` local para reflejar estos cambios.
    *   [ ] **Comando:** `npx prisma db pull` (Esto introspectará la base de datos y actualizará tu `schema.prisma`).
    *   [ ] Revisar los cambios en `schema.prisma` después de la introspección para asegurar que son los esperados.
2.  **Actualización de Tabla `User` (o `Profiles`):**
    *   [ ] Añadir campo `emailVerified` (Boolean) a la tabla de perfiles de usuario (si no es manejado automáticamente por Supabase Auth en una tabla accesible/relacionada por Prisma de forma directa para tu lógica de negocio). Considerar si este estado ya está disponible a través de las tablas de Supabase Auth y si necesitas duplicarlo.
    *   [ ] Añadir campo `profileCompleted` (Boolean) a la tabla de perfiles de usuario para rastrear si el usuario ha completado el formulario de perfil básico por primera vez. Definir valor por defecto en `false`.
    *   [ ] Asegurar que la tabla de perfiles tenga una relación clara con la tabla `auth.users` de Supabase (generalmente mediante un `userId` que coincida con el `id` del usuario en Supabase).
3.  **Generación y Migraciones:**
    *   [ ] Después de cualquier cambio manual en `schema.prisma` (como añadir `profileCompleted`) o después de `db pull` si es necesario ajustar modelos, generar el cliente de Prisma.
    *   [ ] **Comando:** `npx prisma generate`
    *   [ ] Si se han realizado cambios en el esquema que no fueron producto de la introspección (ej. añadir campos a tu tabla de perfiles), crear y aplicar las migraciones correspondientes.
    *   [ ] **Comandos:** `npx prisma migrate dev --name nombre_de_la_migracion` (para desarrollo) o `npx prisma migrate deploy` (para producción).

## Consideraciones Adicionales

*   **Seguridad:**
    *   [ ] Asegurar el correcto hasheo de contraseñas.
    *   [ ] Implementar medidas contra ataques comunes (CSRF, XSS).
    *   [ ] Validar y sanitizar todas las entradas del usuario.
*   **Manejo de Errores:**
    *   [ ] Proveer mensajes de error claros y útiles tanto en el frontend como en las respuestas de la API.
*   **UX/UI:**
    *   [ ] Asegurar un flujo de registro intuitivo y amigable.
    *   [ ] Proveer feedback visual durante las operaciones (e.g., spinners de carga). 