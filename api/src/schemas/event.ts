import { z } from 'zod';
import { createParamIdSchema, createPaginationSchema } from './common';

// Enums para validación
const EventMainType = z.enum(['pool', 'open_water']);
const EventLocationType = z.enum(['pool_25', 'pool_50', 'sea', 'lake', 'river']);
const EventCategory = z.enum(['competitivo', 'formativo', 'travesia']);
const EventStatus = z.enum(['draft', 'soon', 'active', 'finished', 'cancelled']);

// Schema para el costo
const CostSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().length(3),
  description: z.string().optional(),
}).refine(data => data.max >= data.min, {
  message: "El costo máximo debe ser mayor o igual al mínimo"
});

// Schema para arrays de strings
const StringArraySchema = z.array(z.string()).default([]);

export const eventSchemas = {
  // Parámetros de URL
  params: {
    id: createParamIdSchema(),
    slug: z.string().min(1, 'Slug requerido'),
  },

  // Query strings (GET con filtros)
  query: {
    list: createPaginationSchema().extend({
      status: EventStatus.optional(),
      event_main_type: EventMainType.optional(),
      event_location_type: EventLocationType.optional(),
      event_category: EventCategory.optional(),
      is_featured: z.boolean().optional(),
      search: z.string().optional(),
      year: z.number().int().min(2000).max(2100).optional(),
    }),
  },

  // Body (POST/PUT)
  create: z.object({
    name: z.string().min(1, 'Nombre requerido'),
    slug: z.string().min(1, 'Slug requerido'),
    description: z.string().min(1, 'Descripción requerida'),
    short_description: z.string().min(1, 'Descripción corta requerida'),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    location: z.string().min(1, 'Ubicación requerida'),
    coordinates_lat: z.number().optional(),
    coordinates_lng: z.number().optional(),
    max_participants: z.number().int().positive().optional(),
    min_age: z.number().int().min(0).optional(),
    max_age: z.number().int().min(0).optional(),
    organizator_name: z.string().min(1, 'Nombre del organizador requerido'),
    is_own_event: z.boolean().default(false),
    contact_email: z.string().email('Email inválido').optional(),
    contact_phone: z.string().optional(),
    event_main_type: EventMainType,
    event_location_type: EventLocationType,
    event_category: EventCategory,
    status: EventStatus,
    cost: CostSchema.optional(),
    featured_image: z.string().optional(),
    has_gallery: z.boolean().default(false),
    requirements: StringArraySchema,
    equipment: StringArraySchema,
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    previous_event_id: z.number().int().positive().optional(),
    next_event_id: z.number().int().positive().optional(),
  }),

  update: z.object({
    name: z.string().min(1, 'Nombre requerido').optional(),
    slug: z.string().min(1, 'Slug requerido').optional(),
    description: z.string().min(1, 'Descripción requerida').optional(),
    short_description: z.string().min(1, 'Descripción corta requerida').optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    location: z.string().min(1, 'Ubicación requerida').optional(),
    coordinates_lat: z.number().optional(),
    coordinates_lng: z.number().optional(),
    max_participants: z.number().int().positive().optional(),
    min_age: z.number().int().min(0).optional(),
    max_age: z.number().int().min(0).optional(),
    organizator_name: z.string().min(1, 'Nombre del organizador requerido').optional(),
    is_own_event: z.boolean().optional(),
    contact_email: z.string().email('Email inválido').optional(),
    contact_phone: z.string().optional(),
    event_main_type: EventMainType.optional(),
    event_location_type: EventLocationType.optional(),
    event_category: EventCategory.optional(),
    status: EventStatus.optional(),
    cost: CostSchema.optional(),
    featured_image: z.string().optional(),
    has_gallery: z.boolean().optional(),
    requirements: StringArraySchema.optional(),
    equipment: StringArraySchema.optional(),
    is_active: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    previous_event_id: z.number().int().positive().optional(),
    next_event_id: z.number().int().positive().optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    'Debe proporcionar al menos un campo para actualizar'
  ),

  // Schema para distancias
  distance: {
    create: z.object({
      name: z.string().min(1, 'Nombre requerido'),
      distance: z.number().int().positive(),
      distance_display: z.string().min(1, 'Display requerido'),
      max_participants: z.number().int().positive().optional(),
      min_age: z.number().int().min(0).optional(),
      max_age: z.number().int().min(0).optional(),
      requirements: StringArraySchema,
      is_active: z.boolean().default(true),
    }),

    update: z.object({
      name: z.string().min(1, 'Nombre requerido').optional(),
      distance: z.number().int().positive().optional(),
      distance_display: z.string().min(1, 'Display requerido').optional(),
      max_participants: z.number().int().positive().optional(),
      min_age: z.number().int().min(0).optional(),
      max_age: z.number().int().min(0).optional(),
      requirements: StringArraySchema.optional(),
      is_active: z.boolean().optional(),
    }).refine(
      (data) => Object.keys(data).length > 0,
      'Debe proporcionar al menos un campo para actualizar'
    ),
  },

  // Schema para vincular ediciones
  linkEdition: z.object({
    previous_event_id: z.number().int().positive().optional(),
    next_event_id: z.number().int().positive().optional(),
    edition_number: z.number().int().positive().optional(),
  }).refine(
    (data) => data.previous_event_id || data.next_event_id,
    'Debe proporcionar al menos un ID de evento para vincular'
  ),
};

// Tipos inferidos
export type CreateEventData = z.infer<typeof eventSchemas.create>;
export type UpdateEventData = z.infer<typeof eventSchemas.update>;
export type CreateEventDistanceData = z.infer<typeof eventSchemas.distance.create>;
export type UpdateEventDistanceData = z.infer<typeof eventSchemas.distance.update>;
export type LinkEventEditionData = z.infer<typeof eventSchemas.linkEdition>; 