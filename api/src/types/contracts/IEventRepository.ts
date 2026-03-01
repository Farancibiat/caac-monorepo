import { Event, EventStatus, EventMainType, EventLocationType, EventCategory } from '@prisma/client';

/**
 * Tipo para filtros de eventos (undefined permitido por exactOptionalPropertyTypes)
 */
export type EventFilters = {
  page?: number | undefined;
  limit?: number | undefined;
  status?: EventStatus | undefined;
  event_main_type?: EventMainType | undefined;
  event_location_type?: EventLocationType | undefined;
  event_category?: EventCategory | undefined;
  is_featured?: boolean | undefined;
  search?: string | undefined;
  year?: number | undefined;
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
  create(data: CreateEventData & { createdBy: number }): Promise<Event>;
  update(id: number, data: UpdateEventData): Promise<Event>;
  delete(id: number): Promise<void>;
  linkEditions(parentEventId: number, childEventIds: number[]): Promise<void>;
  findEditions(eventId: number): Promise<Event[]>;
  checkSlugExists(slug: string, excludeId?: number): Promise<boolean>;
};

