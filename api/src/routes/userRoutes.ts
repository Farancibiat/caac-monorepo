import express, { Router } from 'express';
import { getUsers, getUserById, createUser, updateUserSocio } from '@/controllers/userController';
import { getProfile, updateProfile, deleteProfile } from '@/controllers/profileController';
import { protect, authorize } from '@/config/auth';
import { Role } from '@prisma/client';
import { schemas, validateBody, validateParams, validateQuery, cleanEmptyStrings } from '@/schemas';
import { withAuth, withAuthAndRole } from '@/utils/authWrapper';

const router: Router = express.Router();

// Rutas de perfil (para usuarios autenticados) - usando ProfileController
router.get('/profile', protect, withAuth(getProfile));
router.put('/profile', protect, cleanEmptyStrings, validateBody(schemas.user.updateProfile), withAuth(updateProfile));
router.delete('/profile', protect, withAuth(deleteProfile));

// Solo administradores pueden ver y crear usuarios
router.get('/', protect, authorize([Role.ADMIN]), validateQuery(schemas.user.query.list), withAuthAndRole(getUsers));
router.get('/:id', protect, authorize([Role.ADMIN]), validateParams(schemas.user.params.id), withAuthAndRole(getUserById));
router.patch('/:id/socio', protect, authorize([Role.ADMIN]), validateParams(schemas.user.params.id), validateBody(schemas.user.updateSocio), withAuthAndRole(updateUserSocio));
router.post('/', protect, authorize([Role.ADMIN]), cleanEmptyStrings, validateBody(schemas.user.create), withAuthAndRole(createUser));

export default router; 