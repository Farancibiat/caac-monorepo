import express, { Router } from 'express';
import { getProfile, updateProfile, checkProfileStatus } from '@/controllers/authController';
import { protect } from '@/config/auth';
import { schemas, validateBody, cleanEmptyStrings } from '@/schemas';
import { withAuth } from '@/utils/authWrapper';

const router: Router = express.Router();


// Rutas protegidas - requieren autenticación con Supabase
router.get('/profile', protect, withAuth(getProfile));
router.put('/profile', protect, cleanEmptyStrings, validateBody(schemas.auth.updateProfile), withAuth(updateProfile));
router.get('/profile-status', protect, withAuth(checkProfileStatus));

export default router; 