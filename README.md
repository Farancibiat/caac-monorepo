# 🏊‍♀️ Aachiloe - Sistema de Reservas de Piscina

Monorepo que contiene la aplicación completa del sistema de reservas de piscina.

## 📁 Estructura del Proyecto

aachiloe/
├── api/ # Backend API (Express + Prisma)
├── frontend/ # Frontend (Next.js + React)
├── package.json # Configuración del workspace
└── README.md # Este archivo

## 🚀 Desarrollo Local

### Instalación inicial
```bash
npm run install:all
```

### Desarrollo
```bash
# Ejecutar ambos proyectos simultáneamente
npm run dev

# O individualmente:
npm run dev:api      # Solo API en puerto 3001
npm run dev:frontend # Solo Frontend en puerto 3000
```

### Build para producción
```bash
npm run build        # Ambos proyectos
npm run build:api    # Solo API
npm run build:frontend # Solo Frontend
```

## 🌐 Despliegue

- **API**: [Render.com](https://render.com)
- **Frontend**: [Netlify](https://netlify.com)
- **Base de Datos**: [Supabase](https://supabase.com)

## 📚 Documentación

- [API Documentation](./api/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🛠️ Tecnologías

### Backend (API)
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Zustand (State Management)