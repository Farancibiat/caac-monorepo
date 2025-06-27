import { Router } from 'express';
import { 
  sendReservationConfirmation, 
  sendReservationReminder, 
  testEmailConfiguration,
  sendContactMessage
} from '@/controllers/emailController';
import { protect } from '@/config/auth';
import { withAuth } from '@/utils/authWrapper';
import { validateBody, cleanEmptyStrings } from '@/middleware/validationMiddleware';
import { contactSchemas } from '@/schemas/contact';
import { contactLimiter } from '@/middleware/rateLimitMiddleware';

const router = Router();

// Rutas públicas (no requieren autenticación)
router.post('/contact', 
  contactLimiter,
  cleanEmptyStrings, 
  validateBody(contactSchemas.sendMessage), 
  sendContactMessage
);

// Rutas protegidas (requieren autenticación)
router.post('/reservation-confirmation', protect, withAuth(sendReservationConfirmation));
router.post('/reservation-reminder', protect, withAuth(sendReservationReminder));
router.get('/test-config', protect, withAuth(testEmailConfiguration));

export default router; 