import { Router } from 'express';
import { 
  sendReservationConfirmation, 
  sendReservationReminder, 
  testEmailConfiguration 
} from '../controllers/emailController';
import { protect } from '../config/auth';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.post('/reservation-confirmation', protect, sendReservationConfirmation);
router.post('/reservation-reminder', protect, sendReservationReminder);
router.get('/test-config', protect, testEmailConfiguration);

export default router; 