import { Event } from '@prisma/client';
import { ServiceResult } from '../common';
import { EventFilters, CreateEventData, UpdateEventData } from './IEventRepository';

/**
 * Tipo para datos de vinculación de ediciones
 */
export type LinkEventEditionData = {
  parentEventId: number;
  childEventIds: number[];
};

/**
 * Contrato para service de eventos
 */
export type IEventService = {
  getAllEvents(filters: EventFilters): Promise<ServiceResult<{ events: Event[]; total: number; totalPages: number }>>;
  getEventBySlug(slug: string): Promise<ServiceResult<Event>>;
  getEventById(id: number): Promise<ServiceResult<Event>>;
  createEvent(data: CreateEventData): Promise<ServiceResult<Event>>;
  updateEvent(id: number, data: UpdateEventData): Promise<ServiceResult<Event>>;
  deleteEvent(id: number): Promise<ServiceResult<void>>;
  linkEventEditions(data: LinkEventEditionData): Promise<ServiceResult<void>>;
  getEventEditions(eventId: number): Promise<ServiceResult<Event[]>>;
};

