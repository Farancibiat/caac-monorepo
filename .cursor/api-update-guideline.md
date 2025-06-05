# API Update Guideline: Migración de JWT Propio a Supabase Auth

## 📋 **RESUMEN EJECUTIVO**

Esta guía detalla la migración de la API desde un sistema de autenticación JWT propio hacia Supabase Auth, aprovechando que **la base de datos ya está configurada y sincronizada** con Supabase Auth.

### **✅ Estado Actual de la Base de Datos (YA COMPLETADO)**
- ✅ Tabla `users` sincronizada con `auth.users` de Supabase
- ✅ Campo `auth_id` como referencia a Supabase Auth
- ✅ Triggers automáticos para sincronización
- ✅ RLS (Row Level Security) configurado
- ✅ Campos `password`, `email`, `name` ya opcionales
- ✅ Campos OAuth agregados (`avatar_url`, `provider`, `provider_id`)

### **🎯 Objetivo**
Reemplazar completamente el sistema de autenticación JWT propio por Supabase Auth, manteniendo toda la funcionalidad existente de roles y autorización.

---

## **🚨 COMPONENTES A ELIMINAR**

### **Archivos/Funciones que sobran:**
```
❌ api/src/controllers/authController.ts     → register(), login() 
❌ api/src/routes/authRoutes.ts              → POST /register, POST /login
❌ api/src/config/auth.ts                    → generateToken(), protect()
❌ api/src/utils/crypto.ts                   → TODO el archivo
❌ Variables: JWT_SECRET, JWT_EXPIRES_IN
```

### **Funcionalidad a mantener:**
```
✅ getProfile(), updateProfile()             → Adaptar para Supabase Auth
✅ Middleware de autorización por roles      → Adaptar para Supabase Auth  
✅ Todos los endpoints de reservas/horarios  → Solo cambiar autenticación
```

---

## **📋 CHECKLIST DE IMPLEMENTACIÓN**

### **FASE 1: PREPARACIÓN E INSTALACIÓN** 🛠️
- [ ] **1.1 Instalar dependencias de Supabase**
  ```bash
  cd api
  npm install @supabase/supabase-js
  ```

- [ ] **1.2 Configurar variables de entorno**
  ```bash
  # En api/.env agregar:
  SUPABASE_URL=tu_supabase_url
  SUPABASE_ANON_KEY=tu_supabase_anon_key
  SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
  ```

- [ ] **1.3 Crear cliente Supabase**
  ```typescript
  // api/src/config/supabase.ts - CREAR NUEVO ARCHIVO
  import { createClient } from '@supabase/supabase-js'
  
  export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
  
  export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  ```

### **FASE 2: ACTUALIZAR MIDDLEWARE DE AUTENTICACIÓN** 🔐
- [ ] **2.1 Reemplazar middleware de protección**
  ```typescript
  // api/src/config/auth.ts - REEMPLAZAR COMPLETAMENTE
  import { Request, Response, NextFunction } from 'express';
  import { supabase } from '@/config/supabase';
  import { sendMessage } from '@/utils/responseHelper';
  import prisma from '@/config/db';
  
  // Extender la interfaz Request
  declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          email: string;
          role: Role;
          auth_id: string;
        };
      }
    }
  }
  
  export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendMessage(res, 'AUTH_NOT_AUTHORIZED');
        return;
      }
  
      const token = authHeader.split(' ')[1];
      
      // Verificar token con Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        sendMessage(res, 'AUTH_TOKEN_INVALID');
        return;
      }
  
      // Obtener datos del usuario desde nuestra tabla
      const dbUser = await prisma.user.findUnique({
        where: { auth_id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          auth_id: true,
        },
      });
  
      if (!dbUser) {
        sendMessage(res, 'AUTH_USER_NOT_FOUND');
        return;
      }
  
      if (!dbUser.isActive) {
        sendMessage(res, 'AUTH_ACCOUNT_DISABLED');
        return;
      }
  
      // Agregar usuario al request
      req.user = {
        id: dbUser.id.toString(),
        email: dbUser.email || user.email || '',
        role: dbUser.role,
        auth_id: dbUser.auth_id!,
      };
  
      next();
    } catch (error) {
      console.error('Error en autenticación:', error);
      sendMessage(res, 'AUTH_TOKEN_INVALID');
    }
  };
  
  // Mantener el middleware de autorización por roles (sin cambios)
  export const authorize = (allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
        return;
      }
  
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        sendMessage(res, 'AUTH_INSUFFICIENT_PERMISSIONS');
      }
    };
  };
  ```

### **FASE 3: ACTUALIZAR CONTROLADORES** 🎮
- [ ] **3.1 Eliminar funciones de registro y login**
  ```typescript
  // api/src/controllers/authController.ts - ELIMINAR:
  // ❌ register()
  // ❌ login()
  ```

- [ ] **3.2 Actualizar getProfile()**
  ```typescript
  // api/src/controllers/authController.ts - ACTUALIZAR:
  export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
        return;
      }
  
      const user = await prisma.user.findUnique({
        where: { auth_id: req.user.auth_id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          avatar_url: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      if (!user) {
        sendMessage(res, 'AUTH_USER_NOT_FOUND');
        return;
      }
  
      sendMessage(res, 'AUTH_PROFILE_RETRIEVED', user);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      sendMessage(res, 'AUTH_PROFILE_ERROR');
    }
  };
  ```

- [ ] **3.3 Actualizar updateProfile()**
  ```typescript
  // api/src/controllers/authController.ts - ACTUALIZAR:
  export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
        return;
      }
  
      const { name, phone } = req.body;
      const updateData: any = {};
      
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      updateData.updatedAt = new Date();
  
      // Actualizar en nuestra base de datos
      const updatedUser = await prisma.user.update({
        where: { auth_id: req.user.auth_id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          avatar_url: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      // Actualizar user_metadata en Supabase
      if (name) {
        await supabase.auth.updateUser({
          data: { full_name: name }
        });
      }
  
      sendMessage(res, 'AUTH_PROFILE_UPDATED', updatedUser);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      sendMessage(res, 'AUTH_UPDATE_ERROR');
    }
  };
  ```

### **FASE 4: AGREGAR ENDPOINT PROFILE COMPLETED** ⭐
- [ ] **4.1 Agregar campo profileCompleted a Prisma**
  ```prisma
  // api/prisma/models/user.prisma - AGREGAR:
  model User {
    // ... campos existentes ...
    profileCompleted  Boolean  @default(false)  // ⭐ NUEVO CAMPO
    // ... resto de campos ...
  }
  ```

- [ ] **4.2 Generar migración**
  ```bash
  cd api
  npx prisma migrate dev --name add_profile_completed
  npx prisma generate
  ```

- [ ] **4.3 Crear endpoint GET /profile-status**
  ```typescript
  // api/src/controllers/authController.ts - AGREGAR:
  export const getProfileStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendMessage(res, 'AUTH_NOT_AUTHENTICATED');
        return;
      }
  
      const user = await prisma.user.findUnique({
        where: { auth_id: req.user.auth_id },
        select: {
          profileCompleted: true,
          name: true,
          email: true,
        },
      });
  
      if (!user) {
        sendMessage(res, 'AUTH_USER_NOT_FOUND');
        return;
      }
  
      sendMessage(res, 'AUTH_PROFILE_RETRIEVED', {
        profileCompleted: user.profileCompleted,
        hasRequiredData: !!(user.name && user.email),
      });
    } catch (error) {
      console.error('Error al obtener estado del perfil:', error);
      sendMessage(res, 'AUTH_PROFILE_ERROR');
    }
  };
  ```

- [ ] **4.4 Modificar updateProfile para marcar completitud**
  ```typescript
  // api/src/controllers/authController.ts - MODIFICAR updateProfile:
  // Agregar al final de updateProfile():
  
  // Si es la primera vez completando el perfil, marcarlo como completado
  if (name && !updatedUser.profileCompleted) {
    await prisma.user.update({
      where: { auth_id: req.user.auth_id },
      data: { profileCompleted: true }
    });
    
    // También actualizar en Supabase user_metadata
    await supabase.auth.updateUser({
      data: { profileCompleted: true }
    });
  }
  ```

### **FASE 5: ACTUALIZAR RUTAS** 🛣️
- [ ] **5.1 Eliminar rutas de registro/login**
  ```typescript
  // api/src/routes/authRoutes.ts - ELIMINAR:
  // ❌ router.post('/register', register);
  // ❌ router.post('/login', login);
  ```

- [ ] **5.2 Agregar nueva ruta**
  ```typescript
  // api/src/routes/authRoutes.ts - AGREGAR:
  import { getProfile, updateProfile, getProfileStatus } from '@/controllers/authController';
  
  // Rutas protegidas
  router.get('/profile', protect, getProfile);
  router.put('/profile', protect, updateProfile);
  router.get('/profile-status', protect, getProfileStatus);  // ⭐ NUEVA
  ```

### **FASE 6: LIMPIAR ARCHIVOS OBSOLETOS** 🧹
- [ ] **6.1 Eliminar archivos innecesarios**
  ```bash
  # Eliminar completamente:
  rm api/src/utils/crypto.ts
  ```

- [ ] **6.2 Limpiar configuración**
  ```typescript
  // api/src/config/auth.ts - Ya reemplazado en Fase 2
  // ❌ Eliminar: generateToken(), variables JWT_SECRET, etc.
  ```

### **FASE 7: ACTUALIZAR OTROS CONTROLADORES** 🔄
- [ ] **7.1 Actualizar userController.ts**
  ```typescript
  // api/src/controllers/userController.ts - MODIFICAR createUser():
  // Eliminar toda la lógica de hash de contraseña
  // El usuario se crea ahora solo desde Supabase Auth via triggers
  
  export const createUser = async (req: Request, res: Response): Promise<void> => {
    // ⚠️ NOTA: La creación de usuarios ahora se maneja via Supabase Auth
    // Este endpoint podría mantenerse solo para admins que quieran
    // actualizar datos adicionales de usuarios existentes
    sendMessage(res, 'USER_CREATE_ERROR', null, 'Use Supabase Auth para crear usuarios');
  };
  ```

### **FASE 8: ACTUALIZAR MENSAJES** 📝
- [ ] **8.1 Agregar nuevos mensajes si es necesario**
  ```typescript
  // api/src/constants/messages.ts - AGREGAR si hace falta:
  200: {
    // ... mensajes existentes ...
    AUTH_PROFILE_STATUS_RETRIEVED: 'Estado del perfil obtenido correctamente',
  }
  ```

### **FASE 9: TESTING Y VALIDACIÓN** ✅
- [ ] **9.1 Verificar endpoints existentes**
  ```bash
  # Probar que estos endpoints sigan funcionando:
  GET  /api/auth/profile          # ✅ Con token de Supabase
  PUT  /api/auth/profile          # ✅ Con token de Supabase  
  GET  /api/auth/profile-status   # ✅ Nuevo endpoint
  
  # Verificar que estos NO funcionen:
  POST /api/auth/register         # ❌ Debe dar 404
  POST /api/auth/login           # ❌ Debe dar 404
  ```

- [ ] **9.2 Verificar autorización por roles**
  ```bash
  # Probar con diferentes roles:
  GET  /api/users                 # Solo ADMIN
  GET  /api/reservations         # ADMIN + TREASURER  
  POST /api/reservations         # USER + ADMIN + TREASURER
  ```

- [ ] **9.3 Verificar sincronización BD**
  ```sql
  -- Verificar que los triggers sigan funcionando:
  SELECT COUNT(*) FROM public.users;
  SELECT COUNT(*) FROM auth.users;
  -- Deben ser iguales
  ```

---

## **🎯 IMPACTO DE LOS SCRIPTS YA EJECUTADOS**

### **✅ Ventajas del trabajo ya realizado:**
1. **Base de datos lista** - No necesitamos migrar esquema ni datos
2. **Sincronización automática** - Los triggers ya manejan la sincronización
3. **RLS configurado** - Las políticas de seguridad ya están implementadas
4. **Campos OAuth preparados** - La tabla ya soporta múltiples providers
5. **No hay usuarios que perder** - Se puede limpiar tranquilamente

### **🔄 Cambios simplificados:**
- ❌ **No necesitamos**: Migrar datos de usuarios
- ❌ **No necesitamos**: Configurar triggers de sincronización  
- ❌ **No necesitamos**: Modificar esquema de base de datos
- ✅ **Solo necesitamos**: Cambiar la lógica de autenticación en la API

---

## **⚠️ CONSIDERACIONES ESPECIALES**

### **Variables de entorno requeridas:**
```bash
# api/.env - AGREGAR:
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# ELIMINAR o comentar:
# JWT_SECRET=...
# JWT_EXPIRES_IN=...
```

### **Orden de implementación recomendado:**
1. **Instalar dependencias** (Fase 1)
2. **Actualizar middleware** (Fase 2) 
3. **Actualizar controladores** (Fase 3)
4. **Agregar profileCompleted** (Fase 4)
5. **Actualizar rutas** (Fase 5)
6. **Limpiar archivos** (Fase 6)
7. **Testing completo** (Fase 9)

### **Rollback plan:**
Si algo falla, simplemente:
1. Revertir cambios en git
2. Restaurar variables de entorno JWT
3. La base de datos seguirá funcionando con ambos sistemas

---

## **✅ CHECKLIST FINAL**

### **Completitud de la migración:**
- [ ] ✅ JWT propio eliminado completamente
- [ ] ✅ Supabase Auth integrado y funcionando  
- [ ] ✅ Todos los endpoints protegidos funcionan
- [ ] ✅ Autorización por roles mantiene funcionalidad
- [ ] ✅ Campo `profileCompleted` implementado
- [ ] ✅ Sincronización BD funcionando
- [ ] ✅ Frontend puede autenticarse con tokens de Supabase
- [ ] ✅ No hay código obsoleto o archivos innecesarios

### **Validación final:**
```bash
# Verificar que la API esté completamente migrada:
curl -H "Authorization: Bearer SUPABASE_TOKEN" localhost:3000/api/auth/profile
curl -H "Authorization: Bearer SUPABASE_TOKEN" localhost:3000/api/auth/profile-status  
curl -H "Authorization: Bearer SUPABASE_TOKEN" localhost:3000/api/reservations
```

---

**🎉 Una vez completado este checklist, la API estará completamente migrada a Supabase Auth y lista para trabajar con el frontend.** 