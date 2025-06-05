import express, { Router } from 'express';
import { getUsers, getUserById, createUser } from '@/controllers/userController';
import { protect, authorize } from '@/config/auth';
import { Role } from '@prisma/client';
import { schemas, validateBody, validateParams, validateQuery, cleanEmptyStrings } from '@/schemas';

const router: Router = express.Router();

// Solo administradores pueden ver y crear usuarios
router.get('/', protect, authorize([Role.ADMIN]), validateQuery(schemas.user.query.list), getUsers);
router.get('/:id', protect, authorize([Role.ADMIN]), validateParams(schemas.user.params.id), getUserById);
router.post('/', protect, authorize([Role.ADMIN]), cleanEmptyStrings, validateBody(schemas.user.create), createUser);

export default router; 