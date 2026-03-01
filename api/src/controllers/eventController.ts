import { Request, Response } from 'express';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { getEventService } from '@/config/container';

/**
 * CONTROLADOR DE EVENTOS - Patrón CSR
 * 
 * Cambios principales:
 * - Eliminado acceso directo a Prisma
 * - Toda la lógica movida a EventService
 * - Solo HTTP handling y validación de parámetros
 * - Consistente con arquitectura CSR
 */

// GET /api/events - Listar eventos
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lista de parámetros válidos
    const validParams = [
      'page', 'limit', 'status', 'event_main_type',
      'event_location_type', 'event_category', 'is_featured',
      'search', 'year'
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

    const eventService = getEventService();
    const filters = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      status: req.query.status as any,
      event_main_type: req.query.event_main_type as any,
      event_location_type: req.query.event_location_type as any,
      event_category: req.query.event_category as any,
      is_featured: req.query.is_featured === 'true' ? true : req.query.is_featured === 'false' ? false : undefined,
      search: req.query.search !== undefined && req.query.search !== '' ? String(req.query.search) : undefined,
      year: req.query.year ? Number(req.query.year) : undefined,
    };

    const result = await eventService.getAllEvents(filters);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_LIST_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'EVENT_FETCH_ERROR');
  }
};

// GET /api/events/:slug - Obtener evento por slug
export const getEventBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      sendMessage(res, 'EVENT_INVALID_SLUG');
      return;
    }
    const eventService = getEventService();

    const result = await eventService.getEventBySlug(slug);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'EVENT_FETCH_ERROR');
  }
};

// POST /api/events - Crear evento
export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const eventService = getEventService();
    const createdBy = parseInt(req.user.id, 10);
    const result = await eventService.createEvent({ ...req.body, createdBy });

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_CREATED', result.data);
  } catch (error) {
    sendMessage(res, 'EVENT_CREATE_ERROR');
  }
};

// PUT /api/events/:id - Actualizar evento
export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eventService = getEventService();

    const result = await eventService.updateEvent(Number(id), req.body);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_UPDATED', result.data);
  } catch (error) {
    sendMessage(res, 'EVENT_UPDATE_ERROR');
  }
};

// DELETE /api/events/:id - Eliminar evento
export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eventService = getEventService();

    const result = await eventService.deleteEvent(Number(id));

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_DELETED');
  } catch (error) {
    sendMessage(res, 'EVENT_DELETE_ERROR');
  }
};

// POST /api/events/link-editions - Vincular ediciones de eventos
export const linkEventEditions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const eventService = getEventService();

    const result = await eventService.linkEventEditions(req.body);

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_EDITIONS_LINKED');
  } catch (error) {
    sendMessage(res, 'EVENT_LINK_ERROR');
  }
};

// GET /api/events/:id/editions - Obtener ediciones de un evento
export const getEventEditions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eventService = getEventService();

    const result = await eventService.getEventEditions(Number(id));

    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'EVENT_EDITIONS_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'EVENT_FETCH_ERROR');
  }
}; 