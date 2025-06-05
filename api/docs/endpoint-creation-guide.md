# Guía de Creación de Endpoints - Arquitectura AAChiloe

## 📋 Resumen

Esta guía detalla el proceso completo para crear endpoints manteniendo la arquitectura establecida del proyecto. Incluye decisiones arquitectónicas, implementación paso a paso y mejores prácticas.

---

## 🎯 Etapa 1: Análisis y Planificación

### 🤔 Preguntas Críticas

#### **1.1 Propósito del Endpoint**
- **¿Qué funcionalidad específica necesito?** (CRUD, búsqueda, acción específica)
- **¿Qué método HTTP es apropiado?** (GET, POST, PUT, DELETE, PATCH)
- **¿Es una operación simple o compleja?** (afecta el diseño del controlador)

#### **1.2 Autenticación y Autorización**
- **¿Requiere autenticación?** (usar middleware `protect`)
- **¿Requiere roles específicos?** (usar middleware `authorize([Role])`)
- **¿Es público, privado o mixto?**

#### **1.3 Datos de Entrada**
- **¿Qué datos recibe?** (body, params, query string)
- **¿Qué validaciones necesito?** (tipos, formatos, rangos, reglas de negocio)
- **¿Hay transformaciones necesarias?** (strings vacíos, fechas, enums)

#### **1.4 Datos de Salida**
- **¿Qué información devuelve?** (entidad completa, parcial, lista, conteo)
- **¿Necesita paginación?** (implementar con schema común)
- **¿Hay datos sensibles a filtrar?** (passwords, tokens, datos internos)

### 📊 Decisiones Arquitectónicas

```typescript
// Matriz de decisiones
const endpointDecisions = {
  authentication: user.isLoggedIn ? 'protect' : 'public',
  authorization: user.needsRole ? 'authorize([Role])' : 'none',
  validation: data.hasInput ? 'zod-schema' : 'none',
  pagination: response.isList ? 'required' : 'optional',
  rateLimit: endpoint.isSensitive ? 'authLimiter' : 'apiLimiter'
}
```

---

## 🏗️ Etapa 2: Implementación

### **2.1 Crear Schema de Validación** *(Si recibe datos)*

```typescript
// api/src/schemas/[module].ts
import { z } from 'zod';
import { commonSchemas, createParamIdSchema } from './common';

export const [module]Schemas = {
  // Parámetros de URL
  params: {
    id: createParamIdSchema(),
    customId: createParamIdSchema('customId'),
  },

  // Query strings (GET con filtros)
  query: {
    list: createPaginationSchema().extend({
      status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
      search: z.string().optional(),
    }),
  },

  // Body (POST/PUT)
  create: z.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    customField: z.string().min(1, 'Campo requerido'),
  }),

  update: z.object({
    name: commonSchemas.name.optional(),
    status: commonSchemas.status.optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    'Debe proporcionar al menos un campo para actualizar'
  ),
};

// Tipos inferidos
export type Create[Module]Data = z.infer<typeof [module]Schemas.create>;
export type Update[Module]Data = z.infer<typeof [module]Schemas.update>;
```

### **2.2 Agregar Mensajes HTTP**

```typescript
// api/src/constants/messages.ts
export const MESSAGES = {
  200: {
    // Lecturas exitosas
    [MODULE]_LIST_RETRIEVED: 'Lista de [entidades] obtenida correctamente',
    [MODULE]_RETRIEVED: '[Entidad] obtenida correctamente',
    [MODULE]_UPDATED: '[Entidad] actualizada correctamente',
    [MODULE]_DELETED: '[Entidad] eliminada correctamente',
  },
  
  201: {
    // Creaciones exitosas
    [MODULE]_CREATED: '[Entidad] creada correctamente',
  },
  
  400: {
    // Errores de validación
    [MODULE]_MISSING_REQUIRED_FIELDS: 'Por favor proporciona todos los campos requeridos',
    [MODULE]_INVALID_ID: 'ID de [entidad] inválido',
    [MODULE]_ALREADY_EXISTS: 'Esta [entidad] ya existe',
  },
  
  404: {
    // No encontrado
    [MODULE]_NOT_FOUND: '[Entidad] no encontrada',
  },
  
  500: {
    // Errores del servidor
    [MODULE]_FETCH_ERROR: 'Error al obtener [entidades]',
    [MODULE]_CREATE_ERROR: 'Error al crear [entidad]',
    [MODULE]_UPDATE_ERROR: 'Error al actualizar [entidad]',
    [MODULE]_DELETE_ERROR: 'Error al eliminar [entidad]',
  },
};
```

### **2.3 Crear Controlador**

```typescript
// api/src/controllers/[module]Controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';
import { Create[Module]Data, Update[Module]Data } from '@/schemas/[module]';

// GET /api/[modules] - Listar con paginación
export const get[Modules] = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search, status } = req.query; // Ya validado por schema
    
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(status && { status }),
    };

    const [items, total] = await Promise.all([
      prisma.[model].findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          // No incluir campos sensibles
        },
      }),
      prisma.[model].count({ where }),
    ]);

    sendMessage(res, '[MODULE]_LIST_RETRIEVED', {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching [modules]:', error);
    sendMessage(res, '[MODULE]_FETCH_ERROR');
  }
};

// GET /api/[modules]/:id - Obtener por ID
export const get[Module]ById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Ya validado y convertido a number

    const item = await prisma.[model].findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Incluir relaciones si es necesario
        relation: {
          select: { id: true, name: true }
        },
      },
    });

    if (!item) {
      sendMessage(res, '[MODULE]_NOT_FOUND');
      return;
    }

    sendMessage(res, '[MODULE]_RETRIEVED', item);
  } catch (error) {
    console.error('Error fetching [module]:', error);
    sendMessage(res, '[MODULE]_FETCH_ERROR');
  }
};

// POST /api/[modules] - Crear
export const create[Module] = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Create[Module]Data = req.body; // Ya validado por schema

    // Validaciones de negocio adicionales
    const existing = await prisma.[model].findUnique({
      where: { email: data.email }
    });

    if (existing) {
      sendMessage(res, '[MODULE]_ALREADY_EXISTS');
      return;
    }

    const newItem = await prisma.[model].create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    sendMessage(res, '[MODULE]_CREATED', newItem);
  } catch (error) {
    console.error('Error creating [module]:', error);
    sendMessage(res, '[MODULE]_CREATE_ERROR');
  }
};

// PUT /api/[modules]/:id - Actualizar
export const update[Module] = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Ya validado
    const data: Update[Module]Data = req.body; // Ya validado

    // Verificar que existe
    const existing = await prisma.[model].findUnique({
      where: { id }
    });

    if (!existing) {
      sendMessage(res, '[MODULE]_NOT_FOUND');
      return;
    }

    const updatedItem = await prisma.[model].update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });

    sendMessage(res, '[MODULE]_UPDATED', updatedItem);
  } catch (error) {
    console.error('Error updating [module]:', error);
    sendMessage(res, '[MODULE]_UPDATE_ERROR');
  }
};

// DELETE /api/[modules]/:id - Eliminar
export const delete[Module] = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.[model].findUnique({
      where: { id }
    });

    if (!existing) {
      sendMessage(res, '[MODULE]_NOT_FOUND');
      return;
    }

    await prisma.[model].delete({
      where: { id }
    });

    sendMessage(res, '[MODULE]_DELETED');
  } catch (error) {
    console.error('Error deleting [module]:', error);
    sendMessage(res, '[MODULE]_DELETE_ERROR');
  }
};
```

### **2.4 Crear Rutas**

```typescript
// api/src/routes/[module]Routes.ts
import express, { Router } from 'express';
import {
  get[Modules],
  get[Module]ById,
  create[Module],
  update[Module],
  delete[Module]
} from '@/controllers/[module]Controller';
import { protect, authorize } from '@/config/auth';
import { Role } from '@prisma/client';
import {
  schemas,
  validateBody,
  validateParams,
  validateQuery,
  cleanEmptyStrings
} from '@/schemas';

const router: Router = express.Router();

// GET /api/[modules] - Listar (requiere auth)
router.get('/',
  protect,
  validateQuery(schemas.[module].query.list),
  get[Modules]
);

// GET /api/[modules]/:id - Obtener por ID (requiere auth)
router.get('/:id',
  protect,
  validateParams(schemas.[module].params.id),
  get[Module]ById
);

// POST /api/[modules] - Crear (solo admin)
router.post('/',
  protect,
  authorize([Role.ADMIN]),
  cleanEmptyStrings,
  validateBody(schemas.[module].create),
  create[Module]
);

// PUT /api/[modules]/:id - Actualizar (solo admin)
router.put('/:id',
  protect,
  authorize([Role.ADMIN]),
  validateParams(schemas.[module].params.id),
  cleanEmptyStrings,
  validateBody(schemas.[module].update),
  update[Module]
);

// DELETE /api/[modules]/:id - Eliminar (solo admin)
router.delete('/:id',
  protect,
  authorize([Role.ADMIN]),
  validateParams(schemas.[module].params.id),
  delete[Module]
);

export default router;
```

### **2.5 Registrar en App Principal**

```typescript
// api/src/index.ts
import [module]Routes from '@/routes/[module]Routes';

// Rutas
app.use('/api/[modules]', [module]Routes);
```

### **2.6 Actualizar Schemas Index**

```typescript
// api/src/schemas/index.ts
export * from './[module]';

import { [module]Schemas } from './[module]';

export const schemas = {
  auth: authSchemas,
  user: userSchemas,
  [module]: [module]Schemas, // ← Agregar aquí
} as const;

export type {
  Create[Module]Data,
  Update[Module]Data,
} from './[module]';
```

---

## ✅ Etapa 3: Verificación

### **3.1 Checklist de Implementación**

- [ ] **Schema de validación** creado y exportado
- [ ] **Mensajes HTTP** agregados para todos los casos
- [ ] **Controlador** implementado con manejo de errores
- [ ] **Rutas** configuradas con middleware apropiado
- [ ] **Autenticación/Autorización** aplicada correctamente
- [ ] **Tipos TypeScript** exportados desde index
- [ ] **Rutas registradas** en app principal

### **3.2 Patrones de Middleware**

```typescript
// Orden recomendado de middleware
router.method('/path',
  protect,                    // 1. Autenticación (si requerida)
  authorize([Role]),          // 2. Autorización (si requerida)
  cleanEmptyStrings,          // 3. Limpieza de datos (si recibe body)
  validateParams(schema),     // 4. Validación params (si tiene :id)
  validateQuery(schema),      // 5. Validación query (si tiene filtros)
  validateBody(schema),       // 6. Validación body (si recibe datos)
  controllerFunction          // 7. Controlador
);
```

### **3.3 Testing Manual**

```bash
# 1. Verificar compilación
npm run build

# 2. Verificar servidor
npm run dev

# 3. Test endpoints con curl/Postman
# GET List
curl -H "Authorization: Bearer <token>" "http://localhost:3000/api/[modules]?page=1&limit=10"

# GET By ID
curl -H "Authorization: Bearer <token>" "http://localhost:3000/api/[modules]/1"

# POST Create
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" \
  -d '{"name":"Test","email":"test@example.com"}' \
  "http://localhost:3000/api/[modules]"
```

---

## 🎨 Mejores Prácticas

### **Naming Conventions**
- **Archivos**: `camelCase` → `userController.ts`, `authRoutes.ts`
- **Funciones**: `camelCase` → `getUsers`, `createUser`
- **Schemas**: `camelCase` → `userSchemas.create`
- **Mensajes**: `UPPER_SNAKE_CASE` → `USER_CREATED`, `AUTH_INVALID`

### **Security First**
- Siempre usar `protect` para rutas privadas
- Aplicar `authorize([Role])` para restricciones de rol
- Validar TODOS los inputs con Zod
- No exponer datos sensibles en responses
- Usar Rate Limiting apropiado

### **Performance**
- Usar `select` en consultas Prisma para campos específicos
- Implementar paginación en listas
- Usar `Promise.all()` para consultas paralelas
- Considerar indices en base de datos

### **Error Handling**
- Siempre usar try/catch en controladores
- Logear errores con contexto suficiente
- Usar mensajes del sistema consistentes
- No exponer errores internos al cliente

---

## 🚀 Pasos de Expansión

### **Para Módulos Complejos**

1. **Relaciones**: Incluir `include` o `select` con relaciones
2. **Búsqueda Avanzada**: Extender query schemas con más filtros
3. **Acciones Específicas**: Crear endpoints para acciones de negocio
4. **Websockets**: Considerar eventos en tiempo real
5. **Cache**: Implementar caching para consultas frecuentes

### **Ejemplo de Acción Específica**

```typescript
// POST /api/orders/:id/confirm - Acción específica
router.post('/:id/confirm',
  protect,
  authorize([Role.ADMIN]),
  validateParams(schemas.order.params.id),
  validateBody(schemas.order.confirm),
  confirmOrder
);
```

---

## 📚 Referencias Rápidas

- **Mensajes**: `api/src/constants/messages.ts`
- **Schemas Comunes**: `api/src/schemas/common.ts`
- **Middleware Auth**: `api/src/config/auth.ts`
- **Validación**: `api/src/middleware/validationMiddleware.ts`
- **Ejemplo Completo**: `api/src/routes/userRoutes.ts`

---

*Esta guía asegura consistencia arquitectónica y escalabilidad en el desarrollo de nuevos endpoints.* 