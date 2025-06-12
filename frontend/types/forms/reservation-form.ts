// Datos para crear reserva
export interface CreateReservationFormData {
  scheduleId: number;
  date: Date;
}

// Datos para confirmar pago
export interface PaymentConfirmationFormData {
  amount: number;
  paymentMethod: string;
  notes?: string;
}

// Datos para verificar disponibilidad
export interface AvailabilityCheckFormData {
  scheduleId: number;
  date: string;
} 