# Lineamientos de Implementación - Endpoints de Eventos

## 📋 Resumen del Plan

Implementación completa de endpoints para gestión de eventos del Club de Aguas Abiertas Chiloé, siguiendo los lineamientos existentes de la API y proporcionando funcionalidad completa para el frontend.

---

## 🗂️ Estructura de Datos Propuesta (Mejorada)

### **Modelo Principal - Event**

```typescript
interface Event {
  // Identificación
  id: number;
  name: string;
  slug: string;                    // Para URLs amigables: "3-desafio-union-islas"
  
  // Descripción
  description: string;             // Descripción completa (HTML permitido)
  shortDescription: string;        // Resumen corto para cards
  
  // Fechas y Duración
  startDate: Date;                 // Fecha de inicio
  endDate?: Date;                   // Fecha de fin (puede ser igual a startDate)
  
  // Ubicación
  location: string;                // "Quinchao, Chiloé"
  coordinates?: {                  // Coordenadas GPS opcionales
    lat: number;
    lng: number;
  };
  
  // Participación
  maxParticipants?: number;        // Límite de participantes (null = sin límite)
  currentEnrolled: number;         // Participantes inscritos (informativo)
  minAge?: number;                 // Edad mínima
  maxAge?: number;                 // Edad máxima
  
  // Distancias
  distances: EventDistance[];      // Array de distancias disponibles
  
  // Organización
  organizator: {
    clubId?: number;               // Foreign key a tabla clubs
    club?: Club;                   // Relación con Club (si existe)
    url?: string;                  // URL del organizador
    name: string;                  // Nombre del organizador
    isOwnEvent: boolean;           // Si es evento propio del club
  };
  contactEmail?: string;           // Email de contacto del evento
  contactPhone?: string;           // Teléfono de contacto
  
  // Clasificación
  eventType: {
    main: 'POOL' | 'OPEN_WATER';
    location: 'POOL_25' | 'POOL_50' | 'LAKE' | 'SEA' | 'LAGOON';
    category: 'TRAVESIA' | 'RECREATIVO' | 'COMPETITIVO' | 'FORMATIVO' | 'INICIACION';
  };
  
  // Estado
  status: 'DRAFT' | 'SOON' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';
  
  // Costo (rango opcional)
  cost?: {                         // null = gratuito
    min?: number;                  // Costo mínimo
    max?: number;                  // Costo máximo
    currency: string;              // "CLP"
    description?: string;          // "Socios: $5.000, No socios: $8.000"
  };
  
  // Relación entre ediciones
  previousEventId?: number;        // ID del evento de la edición anterior
  nextEventId?: number;            // ID del evento de la siguiente edición
  editionNumber?: number;          // Número de edición (1, 2, 3...)
  
  // Media
  featuredImage?: string;          // URL de imagen principal
  hasGallery: boolean;             // Si tiene galería de fotos
  galleryImages?: string[];        // URLs de imágenes de galería
  
  // Requisitos
  requirements?: string[];         // ["Saber nadar", "Certificado médico"]
  equipment?: string[];            // ["Traje de neopreno", "Gafas"]
  
  // Metadata
  isActive: boolean;
  isFeatured: boolean;             // Para destacar en homepage
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;               // ID del usuario que creó el evento
}
```

### **Modelo Secundario - EventDistance**

```typescript
interface EventDistance {
  id: number;
  eventId: number;
  name: string;                    // "Distancia Corta", "Élite"
  distance: number;                // Distancia en metros
  distanceDisplay: string;         // "1.5 km", "2.5 km"
  maxParticipants?: number;        // Límite por distancia (informativo)
  currentEnrolled: number;         // Inscritos en esta distancia (informativo)
  minAge?: number;
  maxAge?: number;
  requirements?: string[];
  isActive: boolean;
}
```

---

## 🚀 Endpoints a Implementar

### **Endpoints Públicos (Sin Autenticación)**

#### **GET /api/events**
**Propósito**: Lista pública de eventos
```typescript
Query Parameters:
- status?: 'SOON' | 'IN_PROGRESS' | 'FINISHED'
- category?: 'TRAVESIA' | 'RECREATIVO' | 'COMPETITIVO' | 'FORMATIVO' | 'INICIACION'
- location?: 'POOL' | 'OPEN_WATER'
- featured?: boolean
- year?: number
- limit?: number (default: 10)
- offset?: number (default: 0)

Response:
{
  success: true,
  message: "Lista de eventos obtenida correctamente",
  data: {
    events: Event[],
    total: number,
    hasMore: boolean
  }
}
```

#### **GET /api/events/:slug**
**Propósito**: Detalles completos de un evento
```typescript
Response:
{
  success: true,
  message: "Evento obtenido correctamente",
  data: {
    event: Event,
    distances: EventDistance[],
    previousEvent?: Event,  // Edición anterior si existe
    nextEvent?: Event       // Próxima edición si existe
  }
}
```

#### **GET /api/events/:eventId/editions**
**Propósito**: Obtener todas las ediciones de un evento
```typescript
Response:
{
  success: true,
  message: "Ediciones del evento obtenidas correctamente",
  data: {
    editions: Event[],
    currentEdition: Event
  }
}
```

### **Endpoints Administrativos (ADMIN)**

#### **POST /api/events**
**Propósito**: Crear nuevo evento
```typescript
Body: CreateEventData

Response:
{
  success: true,
  message: "Evento creado correctamente",
  data: Event
}
```

#### **PUT /api/events/:eventId**
**Propósito**: Actualizar evento
```typescript
Body: Partial<UpdateEventData>

Response:
{
  success: true,
  message: "Evento actualizado correctamente",
  data: Event
}
```

#### **DELETE /api/events/:eventId**
**Propósito**: Eliminar/desactivar evento
```typescript
Response:
{
  success: true,
  message: "Evento eliminado correctamente",
  data: null
}
```

#### **PUT /api/events/:eventId/link-edition**
**Propósito**: Vincular eventos como ediciones (anterior/siguiente)
```typescript
Body:
{
  previousEventId?: number,  // ID del evento anterior
  nextEventId?: number,      // ID del evento siguiente
  editionNumber?: number     // Número de edición
}

Response:
{
  success: true,
  message: "Ediciones vinculadas correctamente",
  data: Event
}
```

---

## 🗃️ Estructura de Archivos Propuesta

### **Prisma Models**
```
api/prisma/models/
├── event.prisma           # Modelo principal de eventos
└── event-distance.prisma  # Distancias por evento
```

### **Controllers**
```
api/src/controllers/
└── eventController.ts           # CRUD básico de eventos y Funciones administrativas
```

### **Routes**
```
api/src/routes/
└── eventRoutes.ts              # Rutas públicas y administrativas
```

### **Schemas de Validación**
```
api/src/schemas/
└── event.ts                    # Validaciones para eventos
```

### **Services** 
```
api/src/services/
└── eventService.ts             # Lógica de negocio de eventos
```

**Explicación de Services**: Los services contienen la lógica de negocio compleja que no debe estar en los controladores. Por ejemplo:
- Validación de vinculación bidireccional de ediciones
- Generación automática de slugs únicos
- Cálculo de estadísticas de eventos
- Normalización de datos de organizadores
- Lógica de caching inteligente

---

## 🔐 Consideraciones de Autorización

### **Permisos por Endpoint**
- **Públicos**: Lista y detalles de eventos, información de ediciones
- **ADMIN**: CRUD completo, vinculación de ediciones

### **Reglas de Negocio**
1. Los eventos son solo informativos (no hay sistema de inscripciones)
2. Los eventos solo pueden ser editados por ADMIN
3. Los eventos no se eliminan, se desactivan
4. Un evento puede tener una edición anterior y una siguiente
5. La vinculación de ediciones debe ser bidireccional (si A es anterior a B, B debe ser siguiente a A)
6. El número de edición debe ser secuencial

---


## 📊 Consideraciones de Performance

### **Índices de Base de Datos**
```sql
-- Índices sugeridos para optimización de consultas
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_edition_chain ON events(previous_event_id, next_event_id);
```

**Estrategia de Índices Explicada**:
- **idx_events_status**: Acelera filtros por estado (SOON, FINISHED, etc.)
- **idx_events_start_date**: Optimiza ordenación cronológica y filtros por fecha
- **idx_events_featured**: Mejora consultas de eventos destacados en homepage
- **idx_events_slug**: Búsqueda rápida por URL amigable (GET /events/:slug)
- **idx_events_category**: Filtros por tipo de evento (TRAVESIA, COMPETITIVO, etc.)
- **idx_events_edition_chain**: Navegación eficiente entre ediciones del mismo evento

---

## 🔄 Migración desde Data Mock Actual

### **Estrategia de Migración**
1. Crear modelos Prisma y migración inicial
2. Script de migración de datos existentes en `frontend/app/(public)/eventos/page.tsx`
3. Poblar base de datos con eventos históricos
4. Testing de endpoints con datos reales

### **Script de Migración Sugerido**
```typescript
// api/src/scripts/migrateEventsData.ts
const mockEvents = [
  // Datos actuales del frontend
];

async function migrateEvents() {
  for (const mockEvent of mockEvents) {
    await prisma.event.create({
      data: {
        name: mockEvent.titulo,
        description: mockEvent.descripcion,
        shortDescription: mockEvent.descripcion.substring(0, 150),
        slug: generateSlug(mockEvent.titulo),
        organizator: {
          name: "Club de Aguas Abiertas Chiloé",
          isOwnEvent: true
        },
        // ... mapear resto de campos
      }
    });
  }
}
```

---

## ✅ Checklist de Implementación

### **Fase 1: Base de Datos**
- [ ] Crear modelos Prisma (Event, EventDistance)
- [ ] Generar y aplicar migración
- [ ] Agregar índices de performance
- [ ] Script de migración de datos mock

### **Fase 2: API Core**
- [ ] Implementar controladores básicos (CRUD)
- [ ] Crear schemas de validación Zod
- [ ] Implementar rutas públicas
- [ ] Agregar middleware de autorización

### **Fase 3: Sistema de Ediciones**
- [ ] Lógica de vinculación de ediciones
- [ ] Endpoints para gestionar ediciones
- [ ] Validaciones de bidireccionalidad
- [ ] Numeración automática de ediciones

### **Fase 4: Endpoints Administrativos**
- [ ] Panel de administración de eventos
- [ ] Gestión de distancias por evento
- [ ] Sistema de vinculación de ediciones
- [ ] Validaciones de estructura de costos

### **Fase 5: Testing y Optimización**
- [ ] Testing completo de endpoints
- [ ] Implementar caché donde corresponda
- [ ] Optimización de consultas
- [ ] Documentación de API

---

## 🎯 Prioridades de Implementación

### **CRÍTICO (Implementar primero)**
1. Modelos de base de datos y migración
2. Endpoints públicos (GET /events, GET /events/:slug)
3. Sistema básico de gestión de eventos
4. Validaciones de reglas de negocio

### **ALTO (Segunda iteración)**
1. Panel administrativo completo
2. Sistema de vinculación de ediciones
3. Gestión de distancias por evento
4. Optimizaciones de performance

### **MEDIO (Tercera iteración)**
1. Sistema de galería de imágenes
2. Funciones de búsqueda avanzada
3. Caché inteligente por categorías
4. API de estadísticas básicas

---

## 💡 Mejoras Propuestas al Diseño Inicial

### **Mejoras Implementadas**
1. **Slug para URLs amigables**: Mejor SEO y UX
2. **Sistema de ediciones**: Vinculación entre eventos de diferentes años
3. **Sistema de distancias flexible**: Soporte para múltiples categorías
4. **Costo con rangos**: Soporte para múltiples tarifas (min-max)
5. **Estados simplificados**: Enfoque informativo sin inscripciones
6. **Campos de contacto**: Mejor comunicación
7. **Sistema de coordenadas**: Integración con mapas
8. **Requisitos y equipamiento**: Información esencial
9. **Sistema de roles simplificado**: Solo Admin para gestión
10. **Numeración de ediciones**: Control automático de versiones

### **Consideraciones Adicionales**
- **Escalabilidad**: Diseño preparado para gran volumen de eventos
- **Flexibilidad**: Soporte para diferentes tipos de eventos
- **Mantenibilidad**: Código organizado y documentado
- **Simplicidad**: Enfoque informativo sin complejidad de inscripciones
- **UX**: API diseñada pensando en el frontend
- **Evolutivo**: Base sólida para agregar funcionalidades futuras

---

## 📝 Notas Sobre Futuras Extensiones

Este diseño simplificado permite agregar fácilmente en el futuro:
- **Sistema de inscripciones**: Reactivar modelos y endpoints comentados
- **Sistema de pagos**: Integración con pasarelas de pago
- **Notificaciones**: Sistema de emails para eventos destacados
- **Análisis**: Reportes y estadísticas avanzadas

---

*Este plan proporciona una base sólida y simple para implementar un sistema informativo de eventos que se integre perfectamente con el frontend y mantenga la consistencia con la arquitectura existente de la API, con capacidad de evolución futura.* 