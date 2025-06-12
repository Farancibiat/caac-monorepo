import { Router } from 'express';
import { 
  sendReservationConfirmation, 
  sendReservationReminder, 
  testEmailConfiguration 
} from '@/controllers/emailController';
import { protect } from '@/config/auth';
import { withAuth } from '@/utils/authWrapper';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.post('/reservation-confirmation', protect, withAuth(sendReservationConfirmation));
router.post('/reservation-reminder', protect, withAuth(sendReservationReminder));
router.get('/test-config', protect, withAuth(testEmailConfiguration));

export default router; 