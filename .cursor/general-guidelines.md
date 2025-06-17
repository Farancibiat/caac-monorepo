# Lineamientos Generales de Desarrollo - Monorepo

## Estructura del Monorepo

### 1. Organización de Directorios
```
aachiloe/
├── api/                    # Backend API (Express + Prisma)
├── frontend/               # Frontend Next.js App
├── shared/                 # Tipos y utilidades compartidas (futuro)
├── .cursor/               # Documentación y lineamientos del proyecto
├── docs/                  # Documentación técnica
└── scripts/               # Scripts de automatización
```

### 2. Gestión de Dependencias
- **Frontend**: `npm` como gestor de paquetes
- **API**: `npm` como gestor de paquetes
- Mantener versiones sincronizadas entre módulos cuando sea posible
- Usar `package-lock.json` para garantizar builds reproducibles

## Estándares de Código

### 1. TypeScript
- **Strict mode activado** en todos los proyectos
- **No usar `any` explícito** - usar `unknown` o tipos específicos
- **Interfaces sobre types** cuando sea posible para mejor extensibilidad
- **Documentación de tipos complejos** con comentarios JSDoc
- **Path aliases obligatorios** - usar `@/` para imports relativos
- **Tipado exhaustivo** - todos los parámetros, retornos y props deben estar tipados

### 2. Convenciones de Nomenclatura
- **Archivos**: `kebab-case` para archivos de configuración, `PascalCase` para componentes
- **Variables y funciones**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces**: Prefijo `I` opcional, descriptivo (`User`, `AuthState`)
- **Types**: Sufijo `Type` cuando sea necesario (`ProfileFormData`)
- **Enums**: `PascalCase` con valores descriptivos

### 3. Estructura de Archivos
- **Un componente por archivo** con nombre descriptivo
- **Índices de barril** (`index.ts`) para exports limpios
- **Separación de concerns**: lógica, UI, tipos en archivos separados
- **Colocation**: archivos relacionados cerca unos de otros

### 4. Imports y Exports
- **Path aliases siempre que sea posible**: `@/components/ui/button` vs `../../../components/ui/button`
- **Named exports preferidos** sobre default exports (excepto páginas Next.js)
- **Imports agrupados y ordenados**:
  1. Librerías externas
  2. Imports internos con `@/`
  3. Imports relativos
- **Re-exports organizados** en archivos index

## Flujos de Desarrollo

### 1. Git Workflow
- **Rama principal**: `main` para producción
- **Rama de desarrollo**: `dev` para integración
- **Feature branches**: `feature/nombre-descriptivo`
- **Hotfix branches**: `hotfix/descripcion-corta`
- **Commits descriptivos** siguiendo conventional commits

### 2. Versionado
- **Semantic Versioning** (SemVer) para releases
- **Changelog automático** basado en commits
- **Tags de versión** para releases importantes


## Performance y Optimización

### 1. Optimización de Imágenes
- **Next.js Image component** obligatorio para imágenes
- **Lazy loading** por defecto
- **WebP format** cuando sea posible
- **Tamaños optimizados** para diferentes viewports

### 2. Code Splitting
- **Dynamic imports** para componentes pesados
- **Lazy loading** de rutas no críticas
- **Prefetch** de rutas críticas
- **Bundle analysis** regular para detectar bloat


## Seguridad

### 1. Autenticación y Autorización
- **Supabase Auth** como proveedor principal
- **JWT tokens** con refresh automático
- **Roles y permisos** granulares
- **Validación en frontend y backend**

### 2. Protección de Datos
- **Sanitización de inputs** obligatoria
- **Validación de datos** con Yup/Zod
- **Headers de seguridad** configurados
- **Rate limiting** en APIs críticas

### 3. Variables de Entorno
- **Nunca commitear** archivos `.env`
- **Prefijo `NEXT_PUBLIC_`** solo para variables públicas
- **Validación de env vars** al inicio de la aplicación
- **Documentación de variables** requeridas



## Deployment

### 1. Ambientes
- **Desarrollo**: `dev.aguasabiertaschiloe.cl` (futuro)
- **Staging**: `staging.aguasabiertaschiloe.cl` (futuro)
- **Producción**: `www.aguasabiertaschiloe.cl`

### 2. CI/CD Pipeline
- **Vercel** para frontend deployment
- **Render.com** para API deployment
- **Supabase** para base de datos PostgreSQL


## Documentación

### 1. Código
- **JSDoc comments** para funciones de lib
- **README.md** centralizados en `docs` divididos para frontend y api para documentación
- **...-guidelines.md** centralizados en `.cursor` para estratégia de desarrollo (división por fases de trabajo para cada feature).








