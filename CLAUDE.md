# Club de Aguas Abiertas Chiloé — Monorepo

Sitio web oficial del club de natación en aguas abiertas de Chiloé.  
Dominio: `www.aguasabiertaschiloe.cl`

## Estructura del monorepo

```
aachiloe/
├── api/          # Backend Express + Prisma + PostgreSQL
├── frontend/     # Frontend Next.js 16
├── docs/         # Documentación técnica de decisiones
└── CLAUDE.md     # Este archivo
```

Workspaces npm: `api` (`@aachiloe/api`) y `frontend` (`@aachiloe/frontend`).

## Stack tecnológico (versiones reales — junio 2026)

| Área | Tecnología |
|------|-----------|
| Frontend | Next.js 16.2.3, React 18, TypeScript 5 |
| UI | Tailwind CSS 3.4.1, Radix UI, shadcn/ui primitives |
| Estado | Zustand 5.0.5 |
| Formularios | React Hook Form 7.57.0 + Yup/Zod |
| Notificaciones | Sonner 2.0.4 |
| Tablas | TanStack React Table 8 |
| Backend | Express 5.2.1, TypeScript 5.8.3 |
| ORM | Prisma 6.8.2 |
| Base de datos | PostgreSQL (Supabase) |
| Auth | Supabase Auth (@supabase/ssr + @supabase/supabase-js) |
| Email | Resend 6.9.3 |

## Despliegue

| Servicio | Plataforma | Notas |
|---------|-----------|-------|
| Frontend | Vercel | auto-deploy desde `main` |
| API | Render.com (free tier) | cold start ~30s tras inactividad |
| Base de datos | Supabase PostgreSQL | multi-schema |
| Auth | Supabase Auth | OAuth Google + email/password |

**CORS API** (configurado en `api/src/index.ts`):
- `https://www.aguasabiertaschiloe.cl`
- `https://aguasabiertaschiloe.cl`
- `http://localhost:3000`

**Supabase redirect URLs**: `https://www.aguasabiertaschiloe.cl/auth/callback`

## Comandos de desarrollo

```bash
# Desde la raíz
npm run dev              # API + Frontend en paralelo
npm run dev:api          # Solo API
npm run dev:frontend     # Solo frontend

npm run build            # Build ambos workspaces
npm run build:api
npm run build:frontend

npm run db:generate      # prisma generate
npm run db:push          # prisma db push
npm run db:migrate       # prisma migrate dev
npm run db:reset         # prisma migrate reset
npm run db:studio        # Prisma Studio
npm run clean            # Elimina dist/, .next, node_modules
```

## Estado del proyecto (junio 2026)

| Módulo | Estado |
|--------|--------|
| Autenticación (login, registro, OAuth Google, completar perfil) | ✅ Producción |
| Páginas públicas (home, nosotros, contacto, política, términos) | ✅ Producción |
| Eventos (calendario público, componentes, datos históricos) | 🚧 En desarrollo |
| Galería | 🚧 En desarrollo (mock "próximamente") |
| Sistema de reservas de piscina | 🚧 En desarrollo (Fase 3) |
| Panel de administración | ⏳ Pendiente (Fase 4) |

## Fases de desarrollo

1. **Fase 1** ✅ Autenticación y configuración base
2. **Fase 2** ✅ Páginas públicas básicas
3. **Fase 3** 🚧 Sistema de reservas (PRIORIDAD ACTUAL)
4. **Fase 4** ⏳ Panel de administración
5. **Fase 5** ⏳ Funcionalidades avanzadas (pagos, emails automáticos)
6. **Fase 6** ⏳ Galería Google Drive, testing E2E, go-live

## Variables de entorno

### API (`api/.env`)
```env
DATABASE_URL=postgresql://...           # Conexión con pooling (Prisma queries)
DIRECT_URL=postgresql://...             # Conexión directa (migraciones Prisma)
NODE_ENV=production
PORT=10000
JWT_SECRET=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=https://api.aguasabiertaschiloe.cl
NEXT_PUBLIC_GA4_MEASUREMENT_ID=...
```

## Convenciones globales

- **TypeScript strict mode** en ambos workspaces — no usar `any` explícito
- **Path aliases** obligatorios: `@/` en frontend, `@/` en API
- **Arrow functions** para componentes React
- **Named exports** preferidos (excepto páginas Next.js que necesitan default export)
- **Interfaces** sobre `type` cuando sea posible
- **Nunca commitear** archivos `.env`
- Consultar [`api/CLAUDE.md`](api/CLAUDE.md) y [`frontend/CLAUDE.md`](frontend/CLAUDE.md) para guías específicas de cada workspace

## Roles del sistema

| Rol | Permisos |
|-----|---------|
| `USER` | Ver/crear/cancelar propias reservas, editar perfil |
| `TREASURER` | Todo lo de USER + confirmar pagos, abrir mes siguiente en Registro Piscina |
| `ADMIN` | Todo lo de TREASURER + gestionar usuarios, editar campo `socio`, configuración del club |
