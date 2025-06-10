# Lineamientos Técnicos - Club de Aguas Abiertas Chiloé

Este documento sirve como índice principal para la documentación técnica del proyecto. Cada sección está detallada en su respectivo archivo.

## Documentación Principal

### 1. [Especificaciones del Proyecto](./project-specs.md)
- Información general del proyecto
- Requisitos de negocio
- Especificaciones de funcionalidades
- Fases de desarrollo
- Consideraciones de seguridad

### 2. [Lineamientos Generales](./general-guidelines.md)
- Flujos de desarrollo
- Estándares de código
- Guías de performance
- Procedimientos de deployment

### 3. [Lineamientos de API](./api-guidelines.md)
- Estructura de la API
- Configuración de Prisma
- Endpoints disponibles
- Seguridad y validación

### 4. [Lineamientos de Frontend](./frontend-guidelines.md)
- Configuración de Next.js
- Arquitectura de la aplicación
- Componentes y stores
- Integración con APIs
- Sistema de reservas
- SEO y deployment

## Stack Tecnológico Principal

### Frontend
- **Framework**: Next.js 14.x con App Router
- **UI Library**: React 18.x
- **Lenguaje**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Componentes**: shadcn/ui
- **Estado**: Zustand 4.x
- **Auth**: Supabase (@supabase/supabase-js v2)

### Backend
- **Framework**: Express.js con TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT + Supabase Auth

## Estructura del Monorepo
```
aachiloe/
├── api/                    # API existente (Express + Prisma)
├── frontend/               # Nueva app Next.js
├── shared/                 # Tipos y utilidades compartidas
└── .cursor/               # Documentación del proyecto
```

## Enlaces Rápidos

### Desarrollo
- [Guía de Contribución](./general-guidelines.md#desarrollo)
- [Estándares de Código](./general-guidelines.md#estándares-de-código)

### API
- [Endpoints](./api-guidelines.md#endpoints-de-la-api)
- [Modelos de Datos](./api-guidelines.md#prisma-schema-multi-archivo)
- [Seguridad](./api-guidelines.md#seguridad)

### Frontend
- [Componentes](./frontend-guidelines.md#componentes-reutilizables)
- [Estado Global](./frontend-guidelines.md#estado-global-con-zustand)
- [Reservas](./frontend-guidelines.md#sistema-de-reservas)

### Deployment
- [Configuración de Producción](./general-guidelines.md#deployment)
- [Variables de Entorno](./frontend-guidelines.md#environment-variables)
- [Headers de Seguridad](./frontend-guidelines.md#headers-de-seguridad)

## Autenticación y Autorización

### Supabase Auth
- Sistema principal de autenticación
- Refresh tokens automáticos
- Persistencia de sesión
- Detección de sesión en URL

### Sistema de Roles
- Extender roles de Supabase vía metadata
- Roles: ADMIN, TREASURER, USER
- Control de acceso basado en roles
- Granularidad de permisos

### Medidas de Seguridad
- Rate limiting (IP y Usuario)
- Forzar HTTPS
- Validación de entradas
- Sanitización de salidas
- Configuración de CORS
- Headers de seguridad

## Sistema de Emails
- Implementación con Resend
- Plantillas React para emails
- Emails transaccionales
- Notificaciones de seguridad

## Estándares de Desarrollo
- Uso de TypeScript
- Principios REST
- Validación de entradas
- Inyección de dependencias
- Principios SOLID

## Requisitos de Testing *Fase Final*
- Pruebas unitarias
- Pruebas de integración
- Monitoreo de cobertura
- Mocking de servicios
- Pruebas de error

## Performance
- Estrategia de caché
- Optimización de consultas
- Connection pooling
- Monitoreo de respuestas
- Implementación de paginación 