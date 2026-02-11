import { Event, Prisma, EventStatus, EventMainType, EventLocationType, EventCategory } from '@prisma/client';

/**
 * Tipo para filtros de eventos
 */
export type EventFilters = {
  page?: number;
  limit?: number;
  status?: EventStatus;
  event_main_type?: EventMainType;
  event_location_type?: EventLocationType;
  event_category?: EventCategory;
  is_featured?: boolean;
  search?: string;
  year?: number;
};

/**
 * Tipo para datos de creación de evento
 */
export type CreateEventData = {
  name: string;
  slug: string;
  description?: string;
  event_main_type: EventMainType;
  event_location_type: EventLocationType;
  event_category: EventCategory;
  location?: string;
  cost?: number;
  is_featured?: boolean;
  status?: EventStatus;
  start_date: Date;
  end_date?: Date;
  registration_start?: Date;
  registration_end?: Date;
};

/**
 * Tipo para datos de actualización de evento
 */
export type UpdateEventData = Partial<CreateEventData>;

/**
 * Contrato para repositorio de eventos
 */
export type IEventRepository = {
  findMany(filters: EventFilters): Promise<{ events: Event[]; total: number }>;
  findBySlug(slug: string): Promise<Event | null>;
  findById(id: number): Promise<Event | null>;
  create(data: CreateEventData): Promise<Event>;
  update(id: number, data: UpdateEventData): Promise<Event>;
  delete(id: number): Promise<void>;
  linkEditions(parentEventId: number, childEventIds: number[]): Promise<void>;
  findEditions(eventId: number): Promise<Event[]>;
  checkSlugExists(slug: string, excludeId?: number): Promise<boolean>;
};

