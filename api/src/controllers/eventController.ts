import { Request, Response } from 'express';
import prisma from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';
import { CreateEventData, UpdateEventData, LinkEventEditionData } from '@/schemas/event';
import { AuthenticatedRequest } from '@/config/auth';
import { Prisma, EventStatus, EventMainType, EventLocationType, EventCategory } from '@prisma/client';

// GET /api/events - Listar eventos
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      event_main_type,
      event_location_type,
      event_category,
      is_featured,
      search,
      year 
    } = req.query;

    // Lista de parámetros válidos
    const validParams = [
      'page',
      'limit',
      'status',
      'event_main_type',
      'event_location_type',
      'event_category',
      'is_featured',
      'search',
      'year'
    ];

    // Verificar si hay parámetros no válidos
    const invalidParams = Object.keys(req.query).filter(
      key => !validParams.includes(key)
    );

    if (invalidParams.length > 0) {
      sendMessage(res, 'INVALID_QUERY_PARAMETERS', {
        invalidParams,
        validParams
      });
      return;
    }

    const where: Prisma.EventWhereInput = {
      ...(status && { status: (status as string).toUpperCase() as EventStatus }),
      ...(event_main_type && { eventMainType: (event_main_type as string).toUpperCase() as EventMainType }),
      ...(event_location_type && { eventLocationType: (event_location_type as string).toUpperCase() as EventLocationType }),
      ...(event_category && { eventCategory: (event_category as string).toUpperCase() as EventCategory }),
      ...(is_featured && { isFeatured: true }),
      ...(year && {
        startDate: {
          gte: new Date(Number(year), 0, 1),
          lt: new Date(Number(year) + 1, 0, 1),
        },
      }),
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { location: { contains: search as string, mode: 'insensitive' } },
        ],
      }),
      isActive: true,
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { startDate: 'desc' },
        include: {
          distances: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              distance: true,
              distanceDisplay: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    sendMessage(res, 'EVENT_LIST_RETRIEVED', {
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    sendMessage(res, 'EVENT_FETCH_ERROR');
  }
};

// GET /api/events/:slug - Obtener evento por slug
export const getEventBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      sendMessage(res, 'EVENT_INVALID_SLUG');
      return;
    }

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        distances: {
          where: { isActive: true },
        },
        previousEvent: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
          },
        },
        nextEvent: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
          },
        },
      },
    });

    if (!event) {
      sendMessage(res, 'EVENT_NOT_FOUND');
      return;
    }

    sendMessage(res, 'EVENT_RETRIEVED', event);
  } catch (error) {
    console.error('Error fetching event:', error);
    sendMessage(res, 'EVENT_FETCH_ERROR');
  }
};

// POST /api/events - Crear evento
export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data: CreateEventData = req.body;

    // Validar que el slug sea único
    const existingEvent = await prisma.event.findUnique({
      where: { slug: data.slug },
    });

    if (existingEvent) {
      sendMessage(res, 'EVENT_ALREADY_EXISTS');
      return;
    }

    // Validar fechas
    if (new Date(data.start_date) > new Date(data.end_date)) {
      sendMessage(res, 'EVENT_INVALID_DATES');
      return;
    }

    const newEvent = await prisma.event.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.short_description,
        location: data.location,
        status: data.status.toUpperCase() as EventStatus,
        requirements: data.requirements,
        equipment: data.equipment,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        organizatorName: data.organizator_name,
        eventMainType: data.event_main_type.toUpperCase() as EventMainType,
        eventLocationType: data.event_location_type.toUpperCase() as EventLocationType,
        eventCategory: data.event_category.toUpperCase() as EventCategory,
        isFeatured: data.is_featured,
        createdBy: Number(req.user!.id),
      },
      include: {
        distances: true,
      },
    });

    sendMessage(res, 'EVENT_CREATED', newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    sendMessage(res, 'EVENT_CREATE_ERROR');
  }
};

// PUT /api/events/:id - Actualizar evento
export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data: UpdateEventData = req.body;

    // Verificar que existe
    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEvent) {
      sendMessage(res, 'EVENT_NOT_FOUND');
      return;
    }

    // Validar fechas si se proporcionan
    if (data.start_date && data.end_date) {
      if (new Date(data.start_date) > new Date(data.end_date)) {
        sendMessage(res, 'EVENT_INVALID_DATES');
        return;
      }
    }

    const updateData: Prisma.EventUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description && { description: data.description }),
      ...(data.short_description && { shortDescription: data.short_description }),
      ...(data.location && { location: data.location }),
      ...(data.status && { status: data.status.toUpperCase() as EventStatus }),
      ...(data.requirements && { requirements: data.requirements }),
      ...(data.equipment && { equipment: data.equipment }),
      ...(data.start_date && { startDate: new Date(data.start_date) }),
      ...(data.end_date && { endDate: new Date(data.end_date) }),
      ...(data.organizator_name && { organizatorName: data.organizator_name }),
      ...(data.event_main_type && { eventMainType: data.event_main_type.toUpperCase() as EventMainType }),
      ...(data.event_location_type && { eventLocationType: data.event_location_type.toUpperCase() as EventLocationType }),
      ...(data.event_category && { eventCategory: data.event_category.toUpperCase() as EventCategory }),
      ...(data.is_featured !== undefined && { isFeatured: data.is_featured }),
    };

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        distances: true,
      },
    });

    sendMessage(res, 'EVENT_UPDATED', updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    sendMessage(res, 'EVENT_UPDATE_ERROR');
  }
};

// DELETE /api/events/:id - Eliminar evento (soft delete)
export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEvent) {
      sendMessage(res, 'EVENT_NOT_FOUND');
      return;
    }

    // Soft delete
    await prisma.event.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });

    sendMessage(res, 'EVENT_DELETED');
  } catch (error) {
    console.error('Error deleting event:', error);
    sendMessage(res, 'EVENT_DELETE_ERROR');
  }
};

// GET /api/events/:id/editions - Obtener ediciones de un evento
export const getEventEditions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        previousEvent: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            editionNumber: true,
            status: true,
            location: true,
            eventMainType: true,
            eventLocationType: true,
            eventCategory: true,
          },
        },
        nextEvent: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            editionNumber: true,
            status: true,
            location: true,
            eventMainType: true,
            eventLocationType: true,
            eventCategory: true,
          },
        },
      },
    });

    if (!event) {
      sendMessage(res, 'EVENT_NOT_FOUND');
      return;
    }

    // Obtener todas las ediciones relacionadas
    const editions = await prisma.event.findMany({
      where: {
        OR: [
          { previousEventId: Number(id) },
          { nextEventId: Number(id) },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        startDate: true,
        endDate: true,
        editionNumber: true,
        status: true,
        location: true,
        eventMainType: true,
        eventLocationType: true,
        eventCategory: true,
      },
      orderBy: { startDate: 'desc' },
    });

    // Construir el árbol de ediciones
    const editionTree = {
      current: {
        ...event,
        previousEvent: event.previousEvent,
        nextEvent: event.nextEvent,
      },
      allEditions: editions,
    };

    sendMessage(res, 'EVENT_EDITIONS_RETRIEVED', editionTree);
  } catch (error) {
    console.error('Error fetching event editions:', error);
    sendMessage(res, 'EVENT_FETCH_ERROR');
  }
};

// PUT /api/events/:id/link-edition - Vincular ediciones
export const linkEventEdition = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data: LinkEventEditionData = req.body;

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!event) {
      sendMessage(res, 'EVENT_NOT_FOUND');
      return;
    }

    // Validar que los eventos a vincular existen
    let previousEvent = null;
    let nextEvent = null;

    if (data.previous_event_id) {
      previousEvent = await prisma.event.findUnique({
        where: { id: data.previous_event_id },
      });
      if (!previousEvent) {
        sendMessage(res, 'EVENT_NOT_FOUND');
        return;
      }
    }

    if (data.next_event_id) {
      nextEvent = await prisma.event.findUnique({
        where: { id: data.next_event_id },
      });
      if (!nextEvent) {
        sendMessage(res, 'EVENT_NOT_FOUND');
        return;
      }
    }

    // Validar orden cronológico
    if (previousEvent && new Date(previousEvent.startDate) >= new Date(event.startDate)) {
      sendMessage(res, 'EVENT_INVALID_EDITION_ORDER');
      return;
    }

    if (nextEvent && new Date(nextEvent.startDate) <= new Date(event.startDate)) {
      sendMessage(res, 'EVENT_INVALID_EDITION_ORDER');
      return;
    }

    // Calcular el número de edición
    let editionNumber = 1;
    if (previousEvent) {
      editionNumber = (previousEvent.editionNumber || 0) + 1;
    }

    // Actualizar el evento con las nuevas relaciones y número de edición
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        ...(data.previous_event_id && { previousEventId: data.previous_event_id }),
        ...(data.next_event_id && { nextEventId: data.next_event_id }),
        editionNumber,
      },
      include: {
        previousEvent: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            editionNumber: true,
            status: true,
            location: true,
            eventMainType: true,
            eventLocationType: true,
            eventCategory: true,
          },
        },
        nextEvent: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            editionNumber: true,
            status: true,
            location: true,
            eventMainType: true,
            eventLocationType: true,
            eventCategory: true,
          },
        },
      },
    });

    // Actualizar el número de edición de los eventos posteriores
    if (data.next_event_id) {
      await prisma.event.update({
        where: { id: data.next_event_id },
        data: {
          editionNumber: editionNumber + 1,
        },
      });
    }

    sendMessage(res, 'EVENT_EDITIONS_LINKED', updatedEvent);
  } catch (error) {
    console.error('Error linking event editions:', error);
    sendMessage(res, 'EVENT_LINK_ERROR');
  }
}; 