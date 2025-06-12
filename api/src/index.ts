import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from '@/middleware/errorMiddleware';
import { securityHeaders } from '@/middleware/securityMiddleware';
import { apiLimiter, authLimiter } from '@/middleware/rateLimitMiddleware';
import { sendMessage } from '@/utils/responseHelper';

// Cargar variables de entorno PRIMERO
dotenv.config();

// Importar configuración de Supabase (esto ejecutará la inicialización)
import '@/config/supabase';

// Importar rutas
import authRoutes from '@/routes/authRoutes';
import scheduleRoutes from '@/routes/scheduleRoutes';
import reservationRoutes from '@/routes/reservationRoutes';
import userRoutes from '@/routes/userRoutes';
import emailRoutes from '@/routes/emailRoutes';
import clubRoutes from '@/routes/clubRoutes';

// Inicializar express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(securityHeaders);
app.use(cors({
  origin: [
    'https://aguasabiertaschiloe.cl',
    'https://www.aguasabiertaschiloe.cl',
    'https://api.aguasabiertaschiloe.cl',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/clubes', clubRoutes);

// Ruta principal
app.get('/', (_req, res) => {
  sendMessage(res, 'APP_WELCOME');
});

// Health check para Render.com
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'aachiloe-api'
  });
});

// Middleware de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

export default app; 