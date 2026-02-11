import { Event } from '@prisma/client';
import { 
  IEventService, 
  IEventRepository, 
  ServiceResult, 
  ServiceResultHelper,
  EventFilters,
  CreateEventData,
  UpdateEventData,
  LinkEventEditionData
} from '@/types';

/**
 * Factory function para crear service de eventos
 * Contiene lógica de negocio extraída de eventController
 */
export const createEventService = (eventRepo: IEventRepository): IEventService => ({

  async getAllEvents(filters: EventFilters): Promise<ServiceResult<{ events: Event[]; total: number; totalPages: number }>> {
    try {
      const { events, total } = await eventRepo.findMany(filters);
      const limit = filters.limit || 10;
      const totalPages = Math.ceil(total / limit);

      return ServiceResultHelper.success({
        events,
        total,
        totalPages,
      });
    } catch (error) {
      return ServiceResultHelper.error('EVENT_FETCH_ERROR');
    }
  },

  async getEventBySlug(slug: string): Promise<ServiceResult<Event>> {
    try {
      if (!slug) {
        return ServiceResultHelper.error('EVENT_INVALID_SLUG');
      }

      const event = await eventRepo.findBySlug(slug);
      
      if (!event) {
        return ServiceResultHelper.error('EVENT_NOT_FOUND');
      }

      return ServiceResultHelper.success(event);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_FETCH_ERROR');
    }
  },

  async getEventById(id: number): Promise<ServiceResult<Event>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('EVENT_INVALID_SLUG');
      }

      const event = await eventRepo.findById(id);
      
      if (!event) {
        return ServiceResultHelper.error('EVENT_NOT_FOUND');
      }

      return ServiceResultHelper.success(event);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_FETCH_ERROR');
    }
  },

  async createEvent(data: CreateEventData): Promise<ServiceResult<Event>> {
    try {
      // Validaciones básicas
      if (!data.name || !data.slug || !data.start_date) {
        return ServiceResultHelper.error('INVALID_QUERY_PARAMETERS');
      }

      // Validar que el slug no exista
      const slugExists = await eventRepo.checkSlugExists(data.slug);
      if (slugExists) {
        return ServiceResultHelper.error('EVENT_ALREADY_EXISTS');
      }

      // Validar fechas
      if (data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
        return ServiceResultHelper.error('EVENT_INVALID_DATES');
      }

      if (data.registration_start && data.registration_end && 
          new Date(data.registration_start) > new Date(data.registration_end)) {
        return ServiceResultHelper.error('EVENT_INVALID_DATES');
      }

      // Validar costo
      if (data.cost !== undefined && data.cost < 0) {
        return ServiceResultHelper.error('EVENT_INVALID_COST');
      }

      const newEvent = await eventRepo.create(data);
      return ServiceResultHelper.success(newEvent);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_CREATE_ERROR');
    }
  },

  async updateEvent(id: number, data: UpdateEventData): Promise<ServiceResult<Event>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('EVENT_INVALID_SLUG');
      }

      // Verificar que el evento existe
      const existingEvent = await eventRepo.findById(id);
      if (!existingEvent) {
        return ServiceResultHelper.error('EVENT_NOT_FOUND');
      }

      // Validar slug si se está actualizando
      if (data.slug && data.slug !== existingEvent.slug) {
        const slugExists = await eventRepo.checkSlugExists(data.slug, id);
        if (slugExists) {
          return ServiceResultHelper.error('EVENT_ALREADY_EXISTS');
        }
      }

      // Validar fechas si se están actualizando
      const startDate = data.start_date || existingEvent.start_date;
      const endDate = data.end_date || existingEvent.end_date;
      
      if (endDate && new Date(startDate) > new Date(endDate)) {
        return ServiceResultHelper.error('EVENT_INVALID_DATES');
      }

      // Validar costo
      if (data.cost !== undefined && data.cost < 0) {
        return ServiceResultHelper.error('EVENT_INVALID_COST');
      }

      const updatedEvent = await eventRepo.update(id, data);
      return ServiceResultHelper.success(updatedEvent);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_UPDATE_ERROR');
    }
  },

  async deleteEvent(id: number): Promise<ServiceResult<void>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('EVENT_INVALID_SLUG');
      }

      // Verificar que el evento existe
      const existingEvent = await eventRepo.findById(id);
      if (!existingEvent) {
        return ServiceResultHelper.error('EVENT_NOT_FOUND');
      }

      await eventRepo.delete(id);
      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_DELETE_ERROR');
    }
  },

  async linkEventEditions(data: LinkEventEditionData): Promise<ServiceResult<void>> {
    try {
      const { parentEventId, childEventIds } = data;

      if (!parentEventId || !childEventIds || childEventIds.length === 0) {
        return ServiceResultHelper.error('EVENT_INVALID_EDITION');
      }

      // Verificar que el evento padre existe
      const parentEvent = await eventRepo.findById(parentEventId);
      if (!parentEvent) {
        return ServiceResultHelper.error('EVENT_NOT_FOUND');
      }

      // Verificar que todos los eventos hijos existen
      for (const childId of childEventIds) {
        const childEvent = await eventRepo.findById(childId);
        if (!childEvent) {
          return ServiceResultHelper.error('EVENT_NOT_FOUND');
        }
      }

      // Validar orden cronológico
      const childEvents = await Promise.all(
        childEventIds.map(id => eventRepo.findById(id))
      );
      
      const sortedEvents = childEvents
        .filter(event => event !== null)
        .sort((a, b) => new Date(a!.start_date).getTime() - new Date(b!.start_date).getTime());

      if (sortedEvents.length !== childEventIds.length) {
        return ServiceResultHelper.error('EVENT_INVALID_EDITION_ORDER');
      }

      await eventRepo.linkEditions(parentEventId, childEventIds);
      return ServiceResultHelper.success(undefined);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_LINK_ERROR');
    }
  },

  async getEventEditions(eventId: number): Promise<ServiceResult<Event[]>> {
    try {
      if (!eventId || isNaN(eventId) || eventId <= 0) {
        return ServiceResultHelper.error('EVENT_INVALID_SLUG');
      }

      // Verificar que el evento padre existe
      const parentEvent = await eventRepo.findById(eventId);
      if (!parentEvent) {
        return ServiceResultHelper.error('EVENT_NOT_FOUND');
      }

      const editions = await eventRepo.findEditions(eventId);
      return ServiceResultHelper.success(editions);
    } catch (error) {
      return ServiceResultHelper.error('EVENT_FETCH_ERROR');
    }
  },

});
