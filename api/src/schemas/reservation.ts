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
    context: z.object({
      monthYear: z.string().regex(/^\d{4}-\d{2}$/, 'monthYear debe ser YYYY-MM'),
    }),
  },

  // Body para crear reserva
  create: z.object({
    scheduleId: z.number().positive('ID de horario debe ser un número positivo'),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha debe ser válida'),
    notes: z.string().optional(),
  }),

  // Body para crear reservas del mes siguiente (varias fechas)
  createBatch: z.object({
    dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Cada fecha debe ser YYYY-MM-DD')).min(1, 'Selecciona al menos una fecha'),
  }),

  // Body para cancelar reserva
  cancel: z.object({
    reason: z.string().min(1, 'Debe proporcionar una razón para la cancelación').optional(),
  }),

  // Body para liberar cupos (lista de IDs; solo fechas futuras, sin reembolso)
  release: z.object({
    reservationIds: z.array(z.number().positive()).min(1, 'Debe seleccionar al menos una reserva'),
  }),

  // Admin: aperturar mes siguiente
  openMonth: z.object({
    dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1, 'Selecciona al menos un día'),
  }),

  // Admin: cancelar días (genera reembolsos)
  cancelDays: z.object({
    dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1, 'Selecciona al menos un día'),
  }),

  // Admin: actualizar capacidad de un día
  updateCapacity: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    scheduleId: z.number().positive(),
    capacityOverride: z.number().int().min(0),
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