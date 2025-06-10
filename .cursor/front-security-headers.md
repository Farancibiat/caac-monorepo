# Headers de Seguridad Frontend - Next.js

## 📋 Resumen

Este documento detalla la implementación de headers de seguridad en el frontend Next.js, aplicando una estrategia de defensa en profundidad con múltiples capas.

---

## 🛡️ Arquitectura de Seguridad - 3 Capas

### **Capa 1: Headers Estáticos (`next.config.mjs`)**
```typescript
// Headers aplicados a todas las rutas automáticamente
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        // Prevención de ataques...
      ]
    }
  ]
}
```

### **Capa 2: Headers Dinámicos (`middleware.ts`)**
```typescript
// Headers basados en contexto y ruta específica
const addSecurityHeaders = (response: NextResponse, request: NextRequest) => {
  // Nonce único por request
  response.headers.set('X-Nonce', crypto.randomUUID());
  
  // Headers específicos por ruta
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
}
```

### **Capa 3: Deployment Level (Netlify/Vercel)**
```toml
# Backup y headers adicionales a nivel de CDN
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
```

---

## 🔒 Headers Implementados

### **Protección contra Clickjacking**
```
X-Frame-Options: DENY
```
- **Propósito**: Previene que la página sea embebida en iframes
- **Alcance**: Todas las rutas
- **Nivel de Protección**: Máximo

### **Protección MIME Sniffing**
```
X-Content-Type-Options: nosniff
```
- **Propósito**: Previene que el browser adivine tipos MIME
- **Alcance**: Todas las rutas
- **Beneficio**: Previene ataques de ejecución de scripts

### **Protección XSS Legacy**
```
X-XSS-Protection: 1; mode=block
```
- **Propósito**: Activar filtro XSS del browser (legacy)
- **Nota**: CSP es la protección principal, esto es backup
- **Alcance**: Todas las rutas

### **Control de Referencia**
```
Referrer-Policy: strict-origin-when-cross-origin
```
- **Propósito**: Controla qué información de referencia se envía
- **Comportamiento**: 
  - Same-origin: Envía URL completa
  - Cross-origin HTTPS: Solo el origen
  - Cross-origin HTTP: No envía nada

### **Content Security Policy**
```csp
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob: https: *.supabase.co;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
frame-src 'self' https://accounts.google.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

#### **Explicación CSP por Directiva:**

- **`default-src 'self'`**: Base restrictiva - solo recursos del mismo origen
- **`script-src`**: Scripts permitidos:
  - `'self'`: Scripts del dominio
  - `'unsafe-inline'`: Necesario para Next.js
  - `'unsafe-eval'`: Necesario para algunas librerías
  - `https://va.vercel-scripts.com`: Analytics Vercel
- **`connect-src`**: APIs permitidas:
  - `'self'`: API del mismo dominio
  - `*.supabase.co`: Backend Supabase
  - `wss://*.supabase.co`: WebSockets Supabase
- **`frame-src`**: iframes permitidos:
  - `https://accounts.google.com`: OAuth Google
- **`img-src`**: Imágenes desde:
  - `'self' data: blob: https:`: Máxima flexibilidad para imágenes
  - `*.supabase.co`: Storage Supabase

### **Headers Dinámicos por Contexto**

#### **Rutas Admin (`/admin/*`)**
```
X-Admin-Access: true
Cache-Control: no-store, no-cache, must-revalidate
```
- **Propósito**: Identificar rutas admin y prevenir caching
- **Seguridad**: Información sensible no se almacena en cache

#### **Rutas de Autenticación (`/login`, `/registro`)**
```
X-Auth-Route: true
Cache-Control: no-cache, no-store, must-revalidate, max-age=0
```
- **Propósito**: Prevenir caching de páginas de autenticación
- **Beneficio**: Previene exposición de tokens/credenciales

#### **Request Tracking**
```
X-Request-ID: [uuid]
X-Nonce: [uuid]
```
- **Propósito**: Identificación única por request
- **Uso**: Debugging, auditoría, CSP nonces

---

## 🚀 Implementación por Etapas

### **Etapa 1: Básicos ✅ COMPLETADO**
- [x] X-Frame-Options
- [x] X-Content-Type-Options  
- [x] X-XSS-Protection
- [x] Referrer-Policy

### **Etapa 2: CSP ✅ COMPLETADO**
- [x] Content Security Policy específico para la app
- [x] Dominios permitidos para Supabase
- [x] OAuth Google frame permissions

### **Etapa 3: Headers Dinámicos ✅ COMPLETADO**
- [x] Context-aware caching headers
- [x] Request tracking
- [x] Admin route protection



---

## 🔧 Configuración Personalizada

### **Para Agregar Nuevos Dominios**
```typescript
// En next.config.mjs, actualizar CSP
"connect-src 'self' https://*.supabase.co https://nuevo-dominio.com"
```

### **Para Rutas con Requisitos Especiales**
```typescript
// En middleware.ts
if (request.nextUrl.pathname.startsWith('/nueva-ruta')) {
  response.headers.set('Custom-Header', 'value');
}
```

### **Para Development vs Production**
```typescript
// Headers diferentes según entorno
const isDev = process.env.NODE_ENV === 'development';
const scriptSrc = isDev 
  ? "'self' 'unsafe-eval' 'unsafe-inline'" 
  : "'self' 'unsafe-inline'";
```

---

## 📊 Testing de Headers

### **Manual Testing**
```bash
# Verificar headers en producción
curl -I https://aguasabiertaschiloe.cl

# Verificar headers específicos
curl -H "Authorization: Bearer token" -I https://aguasabiertaschiloe.cl/admin
```

### **Online Tools**
- [SecurityHeaders.com](https://securityheaders.com)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com)
- [Mozilla Observatory](https://observatory.mozilla.org)

### **Expected Scores**
- **SecurityHeaders.com**: A+ 
- **Mozilla Observatory**: A
- **CSP Evaluator**: Medium-High Risk (debido a 'unsafe-inline' necesario)

---

## 🚨 Troubleshooting

### **CSP Violations Comunes**

#### **Script Blocked**
```
Content Security Policy: The page's settings blocked the loading of a resource
```
**Solución**: Agregar dominio a `script-src` o usar nonce

#### **Style Blocked**
```
Refused to apply inline style because it violates CSP directive
```
**Solución**: Usar `'unsafe-inline'` en `style-src` (ya implementado)

#### **Image Load Failed**
```
Refused to load image because it violates CSP directive
```
**Solución**: Verificar que `img-src` incluya el dominio

### **Headers No Aplicados**

#### **En Development**
- Headers pueden no aparecer en localhost
- Usar herramientas de desarrollo del browser

#### **En Production**
- Verificar que el CDN no esté sobrescribiendo headers
- Comprobar orden de precedencia Netlify/Vercel

---

## 📚 Referencias

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)

---

*Esta implementación proporciona protección robusta contra las principales vulnerabilidades web mientras mantiene la funcionalidad completa de la aplicación.* 