import { z } from 'zod';
import { createParamIdSchema, createPaginationSchema } from './common';

export const reservationSchemas = {
  // Parámetros de URL
  params: {
    id: createParamIdSchema(),
  },

  // Query strings para listado
  query: {
    list: createPaginationSchema().extend({
      status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
      userId: z.coerce.number().positive().optional(),
      scheduleId: z.coerce.number().positive().optional(),
    }),
  },

  // Body para crear reserva
  create: z.object({
    scheduleId: z.number().positive('ID de horario debe ser un número positivo'),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha debe ser válida'),
    notes: z.string().optional(),
  }),

  // Body para cancelar reserva
  cancel: z.object({
    reason: z.string().min(1, 'Debe proporcionar una razón para la cancelación').optional(),
  }),

  // Body para confirmar pago
  confirmPayment: z.object({
    amount: z.number().positive('El monto debe ser un número positivo'),
    paymentMethod: z.string().min(1, 'Método de pago es requerido'),
    transactionId: z.string().optional(),
    notes: z.string().optional(),
  }),

  // Body para completar reserva
  complete: z.object({
    notes: z.string().optional(),
  }),
};

// Tipos inferidos
export type CreateReservationData = z.infer<typeof reservationSchemas.create>;
export type CancelReservationData = z.infer<typeof reservationSchemas.cancel>;
export type ConfirmPaymentData = z.infer<typeof reservationSchemas.confirmPayment>;
export type CompleteReservationData = z.infer<typeof reservationSchemas.complete>; 