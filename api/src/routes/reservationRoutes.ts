import express, { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getAllReservations,
  getUserReservations,
  getReservationById,
  getReservationContext,
  createReservation,
  createReservationBatch,
  releaseSlots,
  cancelReservation,
  confirmPayment,
  completeReservation,
  getAdminCalendar,
  openNextMonth,
  cancelDays,
  updateDayCapacity
} from '@/controllers/reservationController';
import { protect, authorize } from '@/config/auth';
import { schemas, validateBody, validateParams, validateQuery, cleanEmptyStrings } from '@/schemas';
import { withAuth, withAuthAndRole } from '@/utils/authWrapper';

const router: Router = express.Router();

// Rutas para usuarios autenticados
router.get('/my-reservations', protect, withAuth(getUserReservations));
router.get('/context', protect, validateQuery(schemas.reservation.query.context), withAuth(getReservationContext));
router.post('/', protect, cleanEmptyStrings, validateBody(schemas.reservation.create), withAuth(createReservation));
router.post('/batch', protect, cleanEmptyStrings, validateBody(schemas.reservation.createBatch), withAuth(createReservationBatch));
router.post('/release', protect, cleanEmptyStrings, validateBody(schemas.reservation.release), withAuth(releaseSlots));

// Admin / Tesorero: Registro Piscina
router.get('/admin/calendar', protect, authorize([Role.ADMIN, Role.TREASURER]), validateQuery(schemas.reservation.query.context), withAuthAndRole(getAdminCalendar));
router.post('/admin/open-month', protect, authorize([Role.ADMIN, Role.TREASURER]), cleanEmptyStrings, validateBody(schemas.reservation.openMonth), withAuthAndRole(openNextMonth));
router.post('/admin/cancel-days', protect, authorize([Role.ADMIN, Role.TREASURER]), cleanEmptyStrings, validateBody(schemas.reservation.cancelDays), withAuthAndRole(cancelDays));
router.patch('/admin/capacity', protect, authorize([Role.ADMIN, Role.TREASURER]), cleanEmptyStrings, validateBody(schemas.reservation.updateCapacity), withAuthAndRole(updateDayCapacity));

router.put('/:id/cancel', protect, validateParams(schemas.reservation.params.id), cleanEmptyStrings, validateBody(schemas.reservation.cancel), withAuth(cancelReservation));

// Rutas para administradores y tesoreros
router.get('/', protect, authorize([Role.ADMIN, Role.TREASURER]), validateQuery(schemas.reservation.query.list), withAuthAndRole(getAllReservations));
router.put('/:id/confirm-payment', protect, authorize([Role.ADMIN, Role.TREASURER]), validateParams(schemas.reservation.params.id), cleanEmptyStrings, validateBody(schemas.reservation.confirmPayment), withAuthAndRole(confirmPayment));

// Rutas para administradores
router.put('/:id/complete', protect, authorize([Role.ADMIN]), validateParams(schemas.reservation.params.id), cleanEmptyStrings, validateBody(schemas.reservation.complete), withAuthAndRole(completeReservation));

// Ruta para todos (con restricciones en el controlador)
router.get('/:id', protect, validateParams(schemas.reservation.params.id), withAuth(getReservationById));

export default router; 