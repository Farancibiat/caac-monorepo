import express, { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  checkAvailability
} from '@/controllers/scheduleController';
import { protect, authorize } from '@/config/auth';
import { withAuthAndRole } from '@/utils/authWrapper';

const router: Router = express.Router();

// Rutas públicas
router.get('/', getAllSchedules);
router.get('/availability', checkAvailability);
router.get('/:id', getScheduleById);

// Rutas protegidas para administradores
router.post('/', protect, authorize([Role.ADMIN]), withAuthAndRole(createSchedule));
router.put('/:id', protect, authorize([Role.ADMIN]), withAuthAndRole(updateSchedule));
router.delete('/:id', protect, authorize([Role.ADMIN]), withAuthAndRole(deleteSchedule));

export default router; 