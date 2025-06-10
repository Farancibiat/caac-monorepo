# Lineamientos Generales de Desarrollo

## Flujos de Desarrollo


## Estándares de Código

### 1. TypeScript
- Strict mode activado
- No `any` explícito
- Interfaces sobre types cuando sea posible
- Documentación de tipos complejos
- utiliza path alias siempre que se pueda

### 2. React/Next.js
- Componentes funcionales evitando usar function. utiliza arrow functions siempre que puedas para crear componentes.
- Hooks personalizados en archivos separados
- Props tipadas
- Memoización cuando sea necesario


## Performance

### 1. Optimización de Imágenes
- Next.js Image component
- Lazy loading para galería
- WebP format cuando sea posible
- Tamaños optimizados

### 2. Code Splitting
- Dynamic imports para componentes pesados
- Lazy loading de rutas privadas
- Prefetch de rutas críticas

### 3. Caching Strategy
- SWR para datos de reservas
- Optimistic updates para mejor UX
- Cache invalidation después de mutaciones

## Deployment

### 1. Ambientes
- Desarrollo: `dev.aguasabiertaschiloe.cl`
- Producción: `www.aguasabiertaschiloe.cl`

### 2. CI/CD
- Netlify para CD del frontend
- Render.com para API
- Supabase para base de datos PostgreSQL


## Seguridad

### 1. Autenticación
- Supabase Auth como proveedor principal
- Registro y Login con OAuth2 con Google y registro propio.
- Refresh tokens automáticos
- Sesiones persistentes
- Detección de sesión en URL

### 2. Autorización
- Roles extendidos de Supabase
- Control de acceso basado en roles
- Validación de permisos en frontend y backend
- Middleware de autenticación

### 3. Protección de Datos
- Sanitización de inputs
- Validación de datos
- Headers de seguridad
- Rate limiting




