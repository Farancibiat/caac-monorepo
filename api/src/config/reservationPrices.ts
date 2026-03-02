/**
 * Precios por sesión de piscina (en CLP).
 * Única fuente de verdad para cálculo de montos en reservas.
 */
export const RESERVATION_PRICES = {
  /** Socio del club */
  MEMBER: 2_000,
  /** No socio */
  NON_MEMBER: 3_000,
} as const;

export type ReservationPriceType = keyof typeof RESERVATION_PRICES;
