import express, { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub
} from '@/controllers/clubController';
import { protect, authorize } from '@/config/auth';
import { withAuthAndRole } from '@/utils/authWrapper';
import { createParamIdSchema } from '../schemas/common';
import { validateParams } from '@/schemas';

const router: Router = express.Router();

// Rutas públicas
router.get('/', getAllClubs);
router.get('/:id', validateParams(createParamIdSchema()), getClubById);

// Rutas protegidas para administradores
router.post('/', protect, authorize([Role.ADMIN]), withAuthAndRole(createClub));
router.put('/:id', protect, authorize([Role.ADMIN]), withAuthAndRole(updateClub));
router.delete('/:id', protect, authorize([Role.ADMIN]), withAuthAndRole(deleteClub));

export default router; 