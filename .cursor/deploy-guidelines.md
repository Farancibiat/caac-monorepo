# 🚀 Guía de Despliegue - Club de Aguas Abiertas Chiloé

## 📋 Resumen de Arquitectura

- **Frontend**: Netlify en `www.aguasabiertaschiloe.cl`
- **API**: Render.com en `api.aguasabiertaschiloe.cl`
- **Base de datos**: Supabase PostgreSQL
- **Autenticación**: Supabase Auth

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────────────────────────────┐
│          www.aguasabiertaschiloe.cl      │
│                (Netlify)                │
├─────────────────────────────────────────┤
│  Frontend (Next.js)                     │
│  - / (todas las rutas de la app)        │
│  - Calls to api.aguasabiertaschiloe.cl  │
└─────────────────────────────────────────┘
                    │
                    │ Direct API Calls
                    ▼
┌─────────────────────────────────────────┐
│        api.aguasabiertaschiloe.cl       │
│              (Render.com)               │
├─────────────────────────────────────────┤
│  API (Express + Prisma)                 │
│  - /api/auth                            │
│  - /api/reservations                    │
│  - /api/schedules                       │
│  - /api/users                           │
│  - /api/emails                          │
└─────────────────────────────────────────┘
                    │
                    │ Database Connection
                    ▼
┌─────────────────────────────────────────┐
│              Supabase                   │
│         PostgreSQL Database             │
└─────────────────────────────────────────┘
```

---

## 🔧 Fase 1: Configuración de DNS y Dominio

### 1.1 Configurar Subdominio DNS

**Agregar registro CNAME en tu proveedor de DNS:**

```dns
Tipo: CNAME
Nombre: api
Valor: [tu-app-render].onrender.com
TTL: Automático o 300
```

**Resultado**: `api.aguasabiertaschiloe.cl` → `[tu-app].onrender.com`

### 1.2 Configurar Custom Domain en Render.com

1. Ve a tu servicio en Render Dashboard
2. Settings → Custom Domains
3. Agregar: `api.aguasabiertaschiloe.cl`
4. Verificar que SSL se configure automáticamente

### 1.3 Actualizar CORS en la API

**Sin cambios en rutas - mantener estructura actual:**

```typescript
// api/src/index.ts - CORS actualizado
app.use(cors({
  origin: [
    'https://www.aguasabiertaschiloe.cl',
    'https://aguasabiertaschiloe.cl',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### 1.4 Variables de Entorno para la API

```env
# api/.env
DATABASE_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]?schema=public
DIRECT_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]?schema=public
NODE_ENV=production
PORT=10000
JWT_SECRET=[tu-jwt-secret]
SUPABASE_URL=[tu-supabase-url]
SUPABASE_ANON_KEY=[tu-supabase-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
RESEND_API_KEY=[tu-resend-api-key]
```

---

## 🌐 Fase 2: Configuración del Frontend (Netlify)

### 2.1 Variables de Entorno del Frontend

```env
# Frontend Environment Variables en Netlify
NEXT_PUBLIC_API_URL=https://api.aguasabiertaschiloe.cl
NEXT_PUBLIC_SUPABASE_URL=[tu-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-supabase-anon-key]
NEXT_PUBLIC_SITE_URL=https://www.aguasabiertaschiloe.cl
NODE_ENV=production
```

### 2.2 Configuración de Netlify (`frontend/netlify.toml`)

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

# SPA Fallback para rutas del frontend
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de seguridad
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 2.3 Cliente API del Frontend

**Sin cambios necesarios en `frontend/lib/api-client.ts`** - Solo actualizar la variable de entorno `NEXT_PUBLIC_API_URL`

---

## 🔗 Fase 3: Configuración de Supabase

### 3.1 URLs de Configuración en Supabase

**En Supabase Dashboard > Authentication > URL Configuration:**

```
Site URL: https://www.aguasabiertaschiloe.cl

Redirect URLs:
- https://www.aguasabiertaschiloe.cl/auth/callback
- https://www.aguasabiertaschiloe.cl/auth/**
- http://localhost:3000/auth/callback (desarrollo)
```

### 3.2 Configuración de CORS en Supabase

**En Supabase Dashboard > API > CORS:**
```
Allowed origins:
- https://www.aguasabiertaschiloe.cl
- https://api.aguasabiertaschiloe.cl
- http://localhost:3000
```

---

## 📝 Fase 4: Archivos de Configuración Actualizados

### 4.1 API - `api/render.yaml`

```yaml
services:
  - type: web
    name: aachiloe-api
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build && npx prisma generate
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### 4.2 Frontend - `frontend/next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🚀 Fase 5: Secuencia de Despliegue

### 5.1 Orden Recomendado

1. **Configurar DNS**
   ```bash
   # 1. Agregar CNAME: api.aguasabiertaschiloe.cl → [tu-app].onrender.com
   # 2. Configurar custom domain en Render.com
   # 3. Verificar SSL automático
   ```

2. **Actualizar variables de entorno**
   ```bash
   # Frontend (Netlify): NEXT_PUBLIC_API_URL=https://api.aguasabiertaschiloe.cl
   # API (Render): Configurar todas las variables necesarias
   ```

3. **Desplegar API** (Render.com)
   ```bash
   # Push cambios al repositorio (si hay alguno)
   # Verificar: https://api.aguasabiertaschiloe.cl/health
   # Verificar: https://api.aguasabiertaschiloe.cl/api/auth/profile
   ```

4. **Desplegar Frontend** (Netlify)
   ```bash
   # Actualizar variable de entorno
   # Push cambios si hay alguno
   # Verificar: Frontend conectándose a nueva API
   ```

### 5.2 Comandos de Verificación

```bash
# 1. Verificar API en subdominio
curl https://api.aguasabiertaschiloe.cl/health
curl https://api.aguasabiertaschiloe.cl/api/auth/profile

# 2. Verificar conectividad desde frontend
curl -H "Authorization: Bearer TOKEN" https://api.aguasabiertaschiloe.cl/api/auth/profile

# 3. Verificar CORS
curl -H "Origin: https://www.aguasabiertaschiloe.cl" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization" \
     -X OPTIONS \
     https://api.aguasabiertaschiloe.cl/api/auth/profile

# 4. Verificar certificado SSL
curl -I https://api.aguasabiertaschiloe.cl/health
```

---

## ⚠️ Fase 6: Consideraciones Importantes

### 6.1 Limitaciones de Render.com (Plan Free)

- **Cold Start**: La API puede "dormir" tras 15 minutos de inactividad
- **Respuesta lenta**: Primer request después de dormir toma ~30 segundos
- **Solución temporal**: Implementar ping automático o upgrade a plan paid

### 6.2 Configuración de Ping para Mantener API Activa

```javascript
// frontend/utils/keepApiAlive.ts
export const keepApiAlive = () => {
  // Ping cada 10 minutos para evitar cold start
  setInterval(async () => {
    try {
      await fetch('https://api.aguasabiertaschiloe.cl/health');
    } catch (error) {
      console.warn('Keep alive ping failed:', error);
    }
  }, 10 * 60 * 1000); // 10 minutos
};

// Llamar en el layout principal si hay usuario autenticado
```

### 6.3 Fallback para Cold Starts

```typescript
// frontend/lib/api-client.ts - Añadir retry logic
const requestClient = async <T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
  retries: number = 1
): Promise<ApiResponse<T>> => {
  try {
    // ... código existente ...
    
    const response = await fetch(url, fetchOptions);
    
    // Si es un error 503 (service unavailable) y tenemos retries
    if (response.status === 503 && retries > 0) {
      console.log('API warming up, retrying...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return requestClient(endpoint, options, retries - 1);
    }
    
    // ... resto del código ...
    
  } catch (error) {
    if (retries > 0) {
      console.log('Request failed, retrying...', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return requestClient(endpoint, options, retries - 1);
    }
    // ... manejo de error final ...
  }
};
```

---

## ✅ Checklist de Despliegue Completo

### Pre-despliegue
- [ ] Registro DNS CNAME configurado
- [ ] Custom domain configurado en Render.com
- [ ] Variables de entorno preparadas
- [ ] Archivos de configuración actualizados
- [ ] SSL certificado verificado

### Render.com (API)
- [ ] Custom domain: `api.aguasabiertaschiloe.cl` configurado
- [ ] Variables de entorno configuradas
- [ ] Deploy ejecutado exitosamente
- [ ] Health check funcionando: `/health`
- [ ] Endpoints API funcionando: `/api/*`
- [ ] Conexión a Supabase verificada

### Netlify (Frontend)
- [ ] Variable `NEXT_PUBLIC_API_URL` actualizada
- [ ] Deploy ejecutado exitosamente
- [ ] Frontend accesible en dominio principal
- [ ] Conectividad con API en subdominio funcionando

### Supabase
- [ ] URLs de redirect actualizadas
- [ ] CORS configurado correctamente
- [ ] Autenticación funcionando desde dominio principal

### Testing Final
- [ ] Autenticación completa (login/registro)
- [ ] Flujo de reservas funcionando
- [ ] Panel de administración accesible
- [ ] Performance aceptable (considerar cold starts)
- [ ] Monitoreo configurado

---

## 🚨 Troubleshooting Común

### 1. Error de CORS
```
Access to fetch at 'https://api.aguasabiertaschiloe.cl/api/auth/profile' 
from origin 'https://www.aguasabiertaschiloe.cl' has been blocked by CORS policy
```
**Solución**: Verificar configuración CORS en `api/src/index.ts`

### 2. Subdominio no resuelve
```
DNS resolution failed for api.aguasabiertaschiloe.cl
```
**Solución**: Verificar configuración DNS CNAME y custom domain en Render

### 3. API responde lento (Cold Start)
```
Request timeout o 503 Service Unavailable
```
**Solución**: Implementar retry logic o mantener API activa con pings

### 4. Variables de entorno no disponibles
```
process.env.NEXT_PUBLIC_API_URL is undefined
```
**Solución**: Verificar configuración en Netlify Dashboard

---

---

## 🎯 Ventajas de esta Arquitectura

- ✅ **Simplicidad**: Sin proxies complejos
- ✅ **Performance**: Conexión directa a la API
- ✅ **Escalabilidad**: Servicios independientes
- ✅ **Mantenimiento**: Debugging directo
- ✅ **Costo**: Configuración gratuita
- ✅ **Confiabilidad**: Menos puntos de falla

**💡 Esta arquitectura con subdominio proporciona la mejor combinación de simplicidad, performance y mantenibilidad para el proyecto.** 