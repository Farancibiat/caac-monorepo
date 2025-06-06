import express, { Router } from 'express';
import { getProfile, updateProfile, checkProfileStatus } from '@/controllers/authController';
import { protect } from '@/config/auth';
import { schemas, validateBody, cleanEmptyStrings } from '@/schemas';

const router: Router = express.Router();

// NOTA: Las rutas /register y /login fueron eliminadas
// ya que ahora usamos Supabase Auth para la autenticación
// Rutas protegidas - requieren autenticación con Supabase
router.get('/profile', protect, getProfile);
router.put('/profile', protect, cleanEmptyStrings, validateBody(schemas.auth.updateProfile), updateProfile);
router.get('/profile-status', protect, checkProfileStatus);

export default router; 