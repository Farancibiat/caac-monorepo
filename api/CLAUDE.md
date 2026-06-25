# API — Lineamientos técnicos

Express 5 + TypeScript 5 + Prisma 6 + PostgreSQL (Supabase).  
Deploy: Render.com (free), port 10000, health check en `/health`.

## Estructura de directorios

```
api/
├── prisma/
│   ├── schema.prisma          # Datasource + generator (multi-schema)
│   ├── models/
│   │   ├── user.prisma        # User, Profile, roles
│   │   ├── reservation.prisma # Reservation, PaymentRecord, SwimmingSchedule
│   │   └── schedule.prisma    # SwimmingSchedule
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   ├── supabase.ts        # Supabase admin client
│   │   ├── container.ts       # DI container
│   │   └── reservationPrices.ts # Precios fijos (2000/3000 CLP)
│   ├── controllers/           # Handlers de request/response
│   ├── services/              # Lógica de negocio
│   ├── repositories/          # Capa de acceso a datos (Prisma)
│   ├── routes/                # Definición de rutas Express
│   ├── middleware/
│   │   ├── auth.ts            # Verifica JWT Supabase
│   │   ├── errorHandler.ts    # Manejo centralizado de errores
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   └── security.ts        # Headers de seguridad
│   ├── schemas/               # Zod validation schemas
│   ├── types/                 # TypeScript types/interfaces
│   ├── constants/
│   │   └── messages.ts        # Mensajes de respuesta centralizados
│   └── utils/
│       └── email/
│           ├── emailService.ts
│           └── templates/     # HTML templates para Resend
│               ├── reservationConfirmation.html
│               ├── reservationReminder.html
│               ├── contactConfirmation.html
│               └── contactMessage.html
├── scripts/
│   └── copy-templates.js      # Copia templates al dist/ en build
└── render.yaml                # Configuración Render.com
```

## Endpoints disponibles

```
GET  /health                          # Health check (Render.com)

POST /api/auth/...                    # Autenticación Supabase
GET  /api/user/profile                # Perfil del usuario autenticado
PUT  /api/user/profile                # Actualizar perfil
POST /api/user/profile                # Crear perfil (primer acceso)

GET  /api/schedules                   # Lista de horarios
GET  /api/schedules/availability      # Disponibilidad básica

GET  /api/reservations/my-reservations   # Reservas del usuario
POST /api/reservations                   # Crear reserva

GET  /api/emails/...                  # Endpoints de email
POST /api/emails/contact              # Email de contacto

GET  /api/clubes                      # Información del club
GET  /api/events                      # Eventos (admin CRUD)
```

## Autenticación

El middleware `auth.ts` valida el JWT de Supabase en cada request protegida.  
Los roles se leen de `user_metadata` en Supabase: `USER | TREASURER | ADMIN`.

```typescript
// Patrón de uso en rutas
router.get('/protected', authMiddleware, roleMiddleware(['ADMIN']), controller)
```

## Prisma: configuración multi-schema

`schema.prisma` referencia los modelos en `./models/*.prisma`.  
Siempre usar **dos variables de entorno**:
- `DATABASE_URL` → conexión con pooling (queries Prisma)
- `DIRECT_URL` → conexión directa (migraciones)

```bash
npx prisma migrate dev --name nombre   # Crear migración
npx prisma migrate deploy              # Aplicar en producción (en build de Render)
npx prisma generate                    # Regenerar cliente
```

## Modelos de base de datos

| Modelo | Descripción |
|--------|-------------|
| `User` | Usuarios con roles (USER, TREASURER, ADMIN) y campo `socio` (bool, solo editable por ADMIN) |
| `Profile` | Perfil del usuario (nombre, apellido, sexo, teléfono, etc.) |
| `SwimmingSchedule` | Horarios fijos: Lunes 21:00, Miércoles 8:00, Viernes 19:00 |
| `Reservation` | Reservas con estados PENDING/CONFIRMED/CANCELLED/COMPLETED |
| `PaymentRecord` | Registro de pagos confirmados por tesorero |

## Sistema de emails (Resend)

Los templates son archivos HTML en `src/utils/email/templates/`.  
El script `scripts/copy-templates.js` los copia a `dist/` durante el build.

Emails implementados:
- `reservationConfirmation.html` — Detalle de reserva + total a pagar
- `reservationReminder.html` — Recordatorio de sesión
- `contactConfirmation.html` — Confirmación al usuario del formulario de contacto
- `contactMessage.html` — Notificación al club del formulario de contacto

## Mensajes de respuesta

Centralizar **siempre** en `src/constants/messages.ts`. No hardcodear strings de respuesta en controllers.

## Validación

Usar **Zod** en todos los endpoints. Los schemas viven en `src/schemas/`.

```typescript
// Patrón en controller
const body = schema.parse(req.body)  // lanza ZodError si falla
```

## Manejo de errores

El middleware `errorHandler.ts` captura todas las excepciones no manejadas.  
En controllers: usar `next(error)` para pasar errores al handler central.

## Reglas de negocio del sistema de reservas

- **Horarios fijos**: Lunes 21:00 | Miércoles 8:00 | Viernes 19:00
- **Precio socio**: 2.000 CLP por sesión
- **Precio no-socio**: 3.000 CLP por sesión
- **El campo `socio`** en el perfil determina el precio; solo editable por ADMIN
- **Nueva reserva** solo disponible cuando el admin/tesorero abrió el mes siguiente
- **Liberar cupos**: usuario puede liberar sesiones futuras sin reembolso
- **Cancelación admin**: genera registro de reembolso que se descuenta del total a pagar del usuario

## Endpoint de contexto recomendado (reservas)

Para reducir peticiones al cargar la página de reservas:

```
GET /api/reservations/context?monthYear=YYYY-MM
```

Devuelve: calendar (días Lun/Mié/Vie con estado del usuario), canReserveNextMonth, nextMonthAvailableDates, pricing (isSocio + pricePerSession), pendingRefunds, schedules.

## Render.com — consideraciones

- **Cold start**: La API "duerme" tras 15 min de inactividad; primer request tarda ~30s
- **Build command**: `npm install && npm run build && npx prisma generate`
- **Start command**: `npm start`
- **Port**: 10000
- **Health check**: `GET /health`

## Convenciones de código

- TypeScript strict, sin `any` explícito
- Path alias `@/` para todos los imports internos (configurado en `tsconfig.json`)
- Inyección de dependencias via `src/config/container.ts`
- Un controller por dominio, un router por dominio
- Principios REST: verbos HTTP correctos, códigos de estado apropiados
