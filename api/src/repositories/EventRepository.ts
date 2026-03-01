import { PrismaClient, Event, Prisma, EventStatus } from '@prisma/client';
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
      ...(filterOptions.event_main_type && { eventMainType: filterOptions.event_main_type }),
      ...(filterOptions.event_location_type && { eventLocationType: filterOptions.event_location_type }),
      ...(filterOptions.event_category && { eventCategory: filterOptions.event_category }),
      ...(filterOptions.is_featured !== undefined && { isFeatured: filterOptions.is_featured }),
      ...(filterOptions.search && {
        OR: [
          { name: { contains: filterOptions.search, mode: 'insensitive' } },
          { description: { contains: filterOptions.search, mode: 'insensitive' } },
        ],
      }),
      ...(filterOptions.year !== undefined && {
        startDate: {
          gte: new Date(`${filterOptions.year}-01-01`),
          lt: new Date(`${filterOptions.year + 1}-01-01`),
        },
      }),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { startDate: 'asc' },
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

  async create(data: CreateEventData & { createdBy: number }): Promise<Event> {
    const endDateVal = (data as Record<string, unknown>).end_date;
    const input: Prisma.EventCreateInput = {
      name: data.name,
      slug: data.slug,
      description: data.description ?? '',
      shortDescription: String((data as Record<string, unknown>).shortDescription ?? (data as Record<string, unknown>).short_description ?? ''),
      startDate: new Date(((data as Record<string, unknown>).start_date ?? (data as Record<string, unknown>).startDate) as string | Date),
      ...(endDateVal != null && { endDate: new Date(endDateVal as string | Date) }),
      location: data.location ?? '',
      organizatorName: String((data as Record<string, unknown>).organizatorName ?? (data as Record<string, unknown>).organizator_name ?? ''),
      eventMainType: data.event_main_type,
      eventLocationType: data.event_location_type,
      eventCategory: data.event_category,
      createdByUser: { connect: { id: data.createdBy } },
      ...((data as Record<string, unknown>).status != null && { status: (data as Record<string, unknown>).status as EventStatus }),
      ...((data as Record<string, unknown>).is_featured !== undefined && { isFeatured: (data as Record<string, unknown>).is_featured as boolean }),
    };
    return await prisma.event.create({
      data: input,
    });
  },

  async update(id: number, data: UpdateEventData): Promise<Event> {
    const updatePayload: Prisma.EventUpdateInput = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.slug !== undefined) updatePayload.slug = data.slug;
    if (data.description !== undefined) updatePayload.description = data.description;
    if ((data as Record<string, unknown>).short_description !== undefined) updatePayload.shortDescription = (data as Record<string, unknown>).short_description as string;
    if (data.start_date !== undefined) updatePayload.startDate = new Date(data.start_date as string | Date);
    if (data.end_date !== undefined) updatePayload.endDate = new Date(data.end_date as string | Date);
    if (data.location !== undefined) updatePayload.location = data.location;
    if ((data as Record<string, unknown>).organizator_name !== undefined) updatePayload.organizatorName = (data as Record<string, unknown>).organizator_name as string;
    if (data.event_main_type !== undefined) updatePayload.eventMainType = data.event_main_type;
    if (data.event_location_type !== undefined) updatePayload.eventLocationType = data.event_location_type;
    if (data.event_category !== undefined) updatePayload.eventCategory = data.event_category;
    if ((data as Record<string, unknown>).status !== undefined) updatePayload.status = (data as Record<string, unknown>).status as EventStatus;
    if ((data as Record<string, unknown>).is_featured !== undefined) updatePayload.isFeatured = (data as Record<string, unknown>).is_featured as boolean;
    return await prisma.event.update({
      where: { id },
      data: updatePayload,
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.event.delete({
      where: { id },
    });
  },

  async linkEditions(parentEventId: number, childEventIds: number[]): Promise<void> {
    await prisma.event.updateMany({
      where: { id: { in: childEventIds } },
      data: { previousEventId: parentEventId },
    });
  },

  async findEditions(eventId: number): Promise<Event[]> {
    return await prisma.event.findMany({
      where: { previousEventId: eventId },
      orderBy: { startDate: 'asc' },
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

