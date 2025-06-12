import express, { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getAllReservations,
  getUserReservations,
  getReservationById,
  createReservation,
  cancelReservation,
  confirmPayment,
  completeReservation
} from '@/controllers/reservationController';
import { protect, authorize } from '@/config/auth';
import { schemas, validateBody, validateParams, validateQuery, cleanEmptyStrings } from '@/schemas';
import { withAuth, withAuthAndRole } from '@/utils/authWrapper';

const router: Router = express.Router();

// Rutas para usuarios autenticados
router.get('/my-reservations', protect, withAuth(getUserReservations));
router.post('/', protect, cleanEmptyStrings, validateBody(schemas.reservation.create), withAuth(createReservation));
router.put('/:id/cancel', protect, validateParams(schemas.reservation.params.id), cleanEmptyStrings, validateBody(schemas.reservation.cancel), withAuth(cancelReservation));

// Rutas para administradores y tesoreros
router.get('/', protect, authorize([Role.ADMIN, Role.TREASURER]), validateQuery(schemas.reservation.query.list), withAuthAndRole(getAllReservations));
router.put('/:id/confirm-payment', protect, authorize([Role.ADMIN, Role.TREASURER]), validateParams(schemas.reservation.params.id), cleanEmptyStrings, validateBody(schemas.reservation.confirmPayment), withAuthAndRole(confirmPayment));

// Rutas para administradores
router.put('/:id/complete', protect, authorize([Role.ADMIN]), validateParams(schemas.reservation.params.id), cleanEmptyStrings, validateBody(schemas.reservation.complete), withAuthAndRole(completeReservation));

// Ruta para todos (con restricciones en el controlador)
router.get('/:id', protect, validateParams(schemas.reservation.params.id), withAuth(getReservationById));

export default router; 