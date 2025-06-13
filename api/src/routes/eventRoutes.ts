import express, { Router } from 'express';
import {
  getEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventEditions,
  linkEventEdition,
} from '@/controllers/eventController';
import { protect, authorize } from '@/config/auth';
import { Role } from '@prisma/client';
import { validateBody, validateParams, validateQuery, cleanEmptyStrings } from '@/schemas';
import { eventSchemas } from '@/schemas/event';
import { withAuthAndRole } from '@/utils/authWrapper';

const router: Router = express.Router();

// Rutas públicas
router.get('/',
  validateQuery(eventSchemas.query.list),
  getEvents
);

router.get('/:slug',
  validateParams(eventSchemas.params.slug),
  getEventBySlug
);

router.get('/:id/editions',
  validateParams(eventSchemas.params.id),
  getEventEditions
);

// Rutas administrativas
router.post('/',
  protect,
  authorize([Role.ADMIN]),
  cleanEmptyStrings,
  validateBody(eventSchemas.create),
  withAuthAndRole(createEvent)
);

router.put('/:id',
  protect,
  authorize([Role.ADMIN]),
  validateParams(eventSchemas.params.id),
  cleanEmptyStrings,
  validateBody(eventSchemas.update),
  withAuthAndRole(updateEvent)
);

router.delete('/:id',
  protect,
  authorize([Role.ADMIN]),
  validateParams(eventSchemas.params.id),
  withAuthAndRole(deleteEvent)
);

router.put('/:id/link-edition',
  protect,
  authorize([Role.ADMIN]),
  validateParams(eventSchemas.params.id),
  validateBody(eventSchemas.linkEdition),
  withAuthAndRole(linkEventEdition)
);

export default router; 