import express, { Router } from 'express';
import { getUsers, getUserById, createUser, updateProfile, getProfile } from '@/controllers/userController';
import { protect, authorize } from '@/config/auth';
import { Role } from '@prisma/client';
import { schemas, validateBody, validateParams, validateQuery, cleanEmptyStrings } from '@/schemas';

const router: Router = express.Router();

// Rutas de perfil (para usuarios autenticados)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, cleanEmptyStrings, validateBody(schemas.user.updateProfile), updateProfile);

// Solo administradores pueden ver y crear usuarios
router.get('/', protect, authorize([Role.ADMIN]), validateQuery(schemas.user.query.list), getUsers);
router.get('/:id', protect, authorize([Role.ADMIN]), validateParams(schemas.user.params.id), getUserById);
router.post('/', protect, authorize([Role.ADMIN]), cleanEmptyStrings, validateBody(schemas.user.create), createUser);

export default router; 