import { PrismaClient, Event, Prisma } from '@prisma/client';
import { IEventRepository, EventFilters, CreateEventData, UpdateEventData } from '@/types';

/**
 * Repository para operaciones de eventos
 * Factory Function que encapsula acceso a datos de eventos
 */
export const createEventRepository = (prisma: PrismaClient): IEventRepository => ({

  async findMany(filters: EventFilters): Promise<{ events: Event[]; total: number }> {
    const { page = 1, limit = 10, ...filterOptions } = filters;
    
    const where: Prisma.EventWhereInput = {
      ...(filterOptions.status && { status: filterOptions.status }),
      ...(filterOptions.event_main_type && { event_main_type: filterOptions.event_main_type }),
      ...(filterOptions.event_location_type && { event_location_type: filterOptions.event_location_type }),
      ...(filterOptions.event_category && { event_category: filterOptions.event_category }),
      ...(filterOptions.is_featured !== undefined && { is_featured: filterOptions.is_featured }),
      ...(filterOptions.search && {
        OR: [
          { name: { contains: filterOptions.search, mode: 'insensitive' } },
          { description: { contains: filterOptions.search, mode: 'insensitive' } },
        ],
      }),
      ...(filterOptions.year && {
        start_date: {
          gte: new Date(`${filterOptions.year}-01-01`),
          lt: new Date(`${filterOptions.year + 1}-01-01`),
        },
      }),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: [
          { is_featured: 'desc' },
          { start_date: 'asc' },
        ],
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total };
  },

  async findBySlug(slug: string): Promise<Event | null> {
    return await prisma.event.findUnique({
      where: { slug },
    });
  },

  async findById(id: number): Promise<Event | null> {
    return await prisma.event.findUnique({
      where: { id },
    });
  },

  async create(data: CreateEventData): Promise<Event> {
    return await prisma.event.create({
      data,
    });
  },

  async update(id: number, data: UpdateEventData): Promise<Event> {
    return await prisma.event.update({
      where: { id },
      data,
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.event.delete({
      where: { id },
    });
  },

  async linkEditions(parentEventId: number, childEventIds: number[]): Promise<void> {
    // Actualizar eventos hijos para que apunten al padre
    await prisma.event.updateMany({
      where: { id: { in: childEventIds } },
      data: { parent_event_id: parentEventId },
    });
  },

  async findEditions(eventId: number): Promise<Event[]> {
    return await prisma.event.findMany({
      where: { parent_event_id: eventId },
      orderBy: { start_date: 'asc' },
    });
  },

  async checkSlugExists(slug: string, excludeId?: number): Promise<boolean> {
    const event = await prisma.event.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    
    return !!event;
  },

});

