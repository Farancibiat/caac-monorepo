import { reqClient } from '@/lib/api-client';
import type { ReservationContextData } from '@/types/api-responses/reservation-context';

export async function getReservationContext(monthYear: string) {
  const res = await reqClient.get<ReservationContextData>(
    `/api/reservations/context?monthYear=${encodeURIComponent(monthYear)}`
  );
  return res;
}

export async function postReservationBatch(dates: string[]) {
  return reqClient.post<{ reservationIds: number[] }>('/api/reservations/batch', { dates });
}

export async function postReservationRelease(reservationIds: number[]) {
  return reqClient.post<{ released: number }>('/api/reservations/release', { reservationIds });
}
