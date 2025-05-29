# Lineamientos Técnicos - API

## Estructura del Proyecto

```
api/
├── prisma/
│   ├── models/              # Modelos de Prisma separados por dominio
│   │   ├── user.prisma     # Modelos relacionados con usuarios
│   │   ├── reservation.prisma  # Modelos de reservas y pagos
│   │   └── schedule.prisma # Modelos de horarios
│   ├── migrations/         # Migraciones de la base de datos
│   └── schema.prisma      # Schema principal con datasource y generator
├── src/
│   ├── controllers/       # Controladores de la API
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middleware
│   └── utils/           # Utilidades
└── package.json
```

## Configuración de Prisma

### Schema Multi-archivo
- Cada archivo `.prisma` debe contener modelos relacionados por dominio
- Nombres claros y concisos para los archivos
- Archivo `schema.prisma` principal con configuraciones globales

### Variables de Entorno
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"
```

### Migraciones
```bash
# Crear una nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## Implementación de Seguridad

### Middleware de Autenticación
```typescript
// middleware/auth.ts
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Validación de token JWT
  // Verificación de roles
  // etc.
}
```

### Validación de Datos
```typescript
// utils/validators.ts
export const validateReservation = (data: any) => {
  // Validaciones de datos
  // Reglas de negocio
  // etc.
}
```


## Integración con Supabase

### Configuración del Cliente
```typescript
{
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}
```
### Gestión de Roles
- Extender roles de Supabase vía metadata
- Implementar roles: ADMIN, TREASURER, USER
- Almacenar información de roles en user_metadata
- Usar control de acceso basado en roles para endpoints

### Webhooks
- Implementar webhooks para eventos de usuario
- Sincronizar datos de usuario con base de datos local
- Manejar eventos: creación, actualización, eliminación
- Implementar manejo de errores y reintentos

### Rate Limiting
- Implementar límites por usuario

## Sistema de Emails
- Resend para envío de emails
- Plantillas React para emails
- Tipos de emails:
  - Bienvenida
  - Recuperación de contraseña

## Seguridad
- Implementar rate limiting
- Usar HTTPS
- Validar todas las entradas
- Sanitizar salidas
- Implementar CORS correctamente
- Usar headers de seguridad

## Manejo de Errores
- Usar bloques try-catch
- Implementar boundaries de error
- Registrar todos los errores
- Devolver códigos de estado apropiados
- Proporcionar mensajes de error significativos

## Organización del Código
- Usar TypeScript
- Seguir principios REST
- Implementar validación apropiada
- Usar inyección de dependencias
- Seguir principios SOLID


## Performance
- Implementar caché donde sea apropiado
- Optimizar consultas a base de datos
- Usar connection pooling
- Monitorear tiempos de respuesta
- Implementar paginación
