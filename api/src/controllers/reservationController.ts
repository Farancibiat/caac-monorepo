import { Response } from 'express';
import prisma from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { RESERVATION_PRICES } from '@/config/reservationPrices';
import { sendNewReservationBatchEmail, sendReleaseConfirmationEmail } from '@/utils/email/emailService';

/** Formato YYYY-MM-DD para una fecha (sin hora) */
const toDateString = (d: Date): string => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

/**
 * Contexto de reservas para un mes: calendario del usuario, si puede reservar el mes siguiente,
 * precios y reembolsos pendientes. Una sola llamada para la página de reservas.
 */
export const getReservationContext = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { monthYear } = req.query as { monthYear: string };
    const userId = parseInt(req.user.id, 10);

    const [y, m] = monthYear.split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) {
      sendMessage(res, 'RESERVATION_MISSING_AVAILABILITY_DATA');
      return;
    }

    const monthStart = new Date(y, m - 1, 1);
    const monthEnd = new Date(y, m, 0);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { socio: true },
    });
    if (!user) {
      sendMessage(res, 'USER_NOT_FOUND');
      return;
    }

    const schedules = await prisma.swimmingSchedule.findMany({
      where: { dayOfWeek: { in: [1, 3, 5] }, isActive: true },
      orderBy: { dayOfWeek: 'asc' },
    });
    const scheduleByDay: Record<number, { id: number; dayOfWeek: number; label: string }> = {};
    for (const s of schedules) {
      const hour = s.startTime.getHours();
      const min = s.startTime.getMinutes();
      scheduleByDay[s.dayOfWeek] = {
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        label: ['', 'Lunes', 'Miércoles', '', 'Viernes'][s.dayOfWeek] + ` ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
      };
    }

    const calendarDays: { date: string; dayOfWeek: number; status: 'RESERVED' | 'CANCELLED' | null; reservationId?: number }[] = [];
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const d = new Date(y, m - 1, day);
      const dow = d.getDay();
      if (dow !== 1 && dow !== 3 && dow !== 5) continue;
      const schedule = scheduleByDay[dow];
      if (!schedule) continue;

      const dateStr = toDateString(d);
      const dayStart = new Date(y, m - 1, day, 0, 0, 0, 0);
      const dayEnd = new Date(y, m - 1, day, 23, 59, 59, 999);
      const reservation = await prisma.reservation.findFirst({
        where: { userId, scheduleId: schedule.id, date: { gte: dayStart, lte: dayEnd } },
        select: { id: true, status: true },
      });
      calendarDays.push({
        date: dateStr,
        dayOfWeek: dow,
        status: reservation ? (reservation.status === 'CANCELLED' ? 'CANCELLED' : 'RESERVED') : null,
        reservationId: reservation?.id,
      });
    }

    const nextMonthStart = new Date(y, m, 1);
    const nextMonthEnd = new Date(y, m + 1, 0);
    const nextMonthAvailable = await prisma.poolDayAvailability.findMany({
      where: {
        date: { gte: nextMonthStart, lte: nextMonthEnd },
        isAvailable: true,
      },
      select: { date: true },
      orderBy: { date: 'asc' },
    });
    const nextMonthAvailableDates = [...new Set(nextMonthAvailable.map((r) => toDateString(r.date)))].sort();

    const pendingRefundsResult = await prisma.cancellationRefund.aggregate({
      where: { userId, status: 'PENDING' },
      _sum: { amount: true },
    });
    const pendingRefunds = pendingRefundsResult._sum.amount ?? 0;

    const data = {
      monthYear,
      calendar: calendarDays,
      canReserveNextMonth: nextMonthAvailableDates.length > 0,
      nextMonthAvailableDates,
      pricing: {
        isSocio: user.socio,
        pricePerSession: user.socio ? RESERVATION_PRICES.MEMBER : RESERVATION_PRICES.NON_MEMBER,
      },
      pendingRefunds,
      schedules: Object.values(scheduleByDay),
    };

    sendMessage(res, 'RESERVATION_CONTEXT_RETRIEVED', data);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

// Obtener todas las reservas (admin/tesorero)
export const getAllReservations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, date, userId } = req.query;
    
    // Construir filtros
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      filter.date = new Date(date as string);
    }
    
    if (userId) {
      filter.userId = Number(userId);
    }
    
    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        schedule: true,
      },
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    
    sendMessage(res, 'RESERVATION_LIST_RETRIEVED', reservations);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

// Obtener reservas del usuario actual
export const getUserReservations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    
    // Construir filtro
    const filter: any = {
      userId: parseInt(req.user.id),
    };
    
    if (status) {
      filter.status = status;
    }
    
    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        schedule: true,
      },
      orderBy: [
        { date: 'asc' },
      ],
    });
    
    sendMessage(res, 'RESERVATION_USER_LIST_RETRIEVED', reservations);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

// Obtener una reserva por ID
export const getReservationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        schedule: true,
        paymentRecords: req.user.role === 'USER' ? false : true,
      },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // Si el usuario no es admin ni tesorero, verificar que la reserva sea del usuario
    if (req.user.role === 'USER' && reservation.userId !== parseInt(req.user.id)) {
      sendMessage(res, 'RESERVATION_INSUFFICIENT_PERMISSIONS');
      return;
    }
    
    sendMessage(res, 'RESERVATION_RETRIEVED', reservation);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

/** Obtiene primer y último día del mes siguiente (local) */
const getNextMonthRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
  return { start, end };
};

/** Crea reservas para el mes siguiente (varias fechas). Valida disponibilidad, capacidad y calcula monto. Envía email. */
export const createReservationBatch = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { dates: dateStrings } = req.body as { dates: string[] };
    const userId = parseInt(req.user.id, 10);
    const { start: nextStart, end: nextEnd } = getNextMonthRange();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, socio: true },
    });
    if (!user?.email) {
      sendMessage(res, 'USER_NOT_FOUND');
      return;
    }

    const schedules = await prisma.swimmingSchedule.findMany({
      where: { dayOfWeek: { in: [1, 3, 5] }, isActive: true },
    });
    const scheduleByDay: Record<number, (typeof schedules)[0]> = {};
    for (const s of schedules) scheduleByDay[s.dayOfWeek] = s;

    const pricePerSession = user.socio ? RESERVATION_PRICES.MEMBER : RESERVATION_PRICES.NON_MEMBER;
    const pendingRefundsResult = await prisma.cancellationRefund.aggregate({
      where: { userId, status: 'PENDING' },
      _sum: { amount: true },
    });
    const pendingRefunds = pendingRefundsResult._sum.amount ?? 0;

    const toCreate: { date: Date; scheduleId: number }[] = [];
    for (const dateStr of dateStrings) {
      const d = new Date(dateStr + 'T12:00:00');
      if (isNaN(d.getTime()) || d < nextStart || d > nextEnd) {
        sendMessage(res, 'RESERVATION_INVALID_DATES');
        return;
      }
      const dow = d.getDay();
      if (dow !== 1 && dow !== 3 && dow !== 5) {
        sendMessage(res, 'RESERVATION_INVALID_DATES');
        return;
      }
      const schedule = scheduleByDay[dow];
      if (!schedule) {
        sendMessage(res, 'SCHEDULE_NOT_FOUND');
        return;
      }

      const available = await prisma.poolDayAvailability.findFirst({
        where: { date: d, scheduleId: schedule.id },
      });
      if (!available?.isAvailable) {
        sendMessage(res, 'RESERVATION_DAY_NOT_AVAILABLE');
        return;
      }

      const capacity = available.capacityOverride ?? schedule.maxCapacity;
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const count = await prisma.reservation.count({
        where: { scheduleId: schedule.id, date: { gte: dayStart, lte: dayEnd }, status: { not: 'CANCELLED' } },
      });
      if (count >= capacity) {
        sendMessage(res, 'RESERVATION_NO_CAPACITY');
        return;
      }

      const existing = await prisma.reservation.findFirst({
        where: { userId, scheduleId: schedule.id, date: d, status: { not: 'CANCELLED' } },
      });
      if (existing) {
        sendMessage(res, 'RESERVATION_ALREADY_EXISTS');
        return;
      }

      toCreate.push({ date: new Date(dateStr + 'T12:00:00'), scheduleId: schedule.id });
    }

    if (toCreate.length === 0) {
      sendMessage(res, 'RESERVATION_INVALID_DATES');
      return;
    }

    const grossTotal = toCreate.length * pricePerSession;
    const totalAmount = Math.max(0, grossTotal - pendingRefunds);

    const created = await prisma.$transaction(
      toCreate.map(({ date, scheduleId }) =>
        prisma.reservation.create({
          data: { userId, scheduleId, date, status: 'PENDING', isPaid: false },
          include: { schedule: true },
        })
      )
    );

    const datesFormatted = toCreate.map(({ date }) => toDateString(date)).join(', ');
    await sendNewReservationBatchEmail(user.email, {
      userName: user.name || 'Usuario',
      datesList: datesFormatted,
      sessionCount: created.length,
      pricePerSession,
      totalAmount,
      reembolsosDescontados: pendingRefunds > 0 ? pendingRefunds : undefined,
    });

    sendMessage(res, 'RESERVATION_CREATED', {
      reservations: created,
      totalAmount,
      sessionCount: created.length,
      paymentInstructions: {
        accountHolder: process.env.PAYMENT_ACCOUNT_HOLDER || 'Club de Aguas Abiertas Chiloé',
        bank: process.env.PAYMENT_BANK || 'Banco Estado',
        accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || 'Cuenta corriente',
      },
    });
  } catch (error) {
    sendMessage(res, 'RESERVATION_CREATE_ERROR');
  }
};

// Crear una nueva reserva
export const createReservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {

    const { scheduleId, date } = req.body;
    
    // Verificar si el horario existe
    const schedule = await prisma.swimmingSchedule.findUnique({
      where: { id: Number(scheduleId) },
    });
    
    if (!schedule) {
      sendMessage(res, 'SCHEDULE_NOT_FOUND');
      return;
    }
    
    // Verificar si el horario está activo
    if (!schedule.isActive) {
      sendMessage(res, 'SCHEDULE_INACTIVE');
      return;
    }
    
    // Verificar disponibilidad
    const reservationDate = new Date(date);
    const existingReservationsCount = await prisma.reservation.count({
      where: {
        scheduleId: Number(scheduleId),
        date: reservationDate,
        status: {
          not: 'CANCELLED',
        },
      },
    });
    
    if (existingReservationsCount >= schedule.maxCapacity) {
      sendMessage(res, 'RESERVATION_NO_CAPACITY');
      return;
    }
    
    // Verificar si el usuario ya tiene una reserva en ese horario y fecha
    const existingUserReservation = await prisma.reservation.findFirst({
      where: {
        userId: parseInt(req.user.id),
        scheduleId: Number(scheduleId),
        date: reservationDate,
        status: {
          not: 'CANCELLED',
        },
      },
    });
    
    if (existingUserReservation) {
      sendMessage(res, 'RESERVATION_ALREADY_EXISTS');
      return;
    }
    
    // Crear la reserva
    const newReservation = await prisma.reservation.create({
      data: {
        userId: parseInt(req.user.id),
        scheduleId: Number(scheduleId),
        date: reservationDate,
        status: 'PENDING',
        isPaid: false,
      },
      include: {
        schedule: true,
      },
    });
    
    sendMessage(res, 'RESERVATION_CREATED', newReservation);
  } catch (error) {
    sendMessage(res, 'RESERVATION_CREATE_ERROR');
  }
};

/** Liberar cupos: cancelar reservas del usuario (solo futuras, sin reembolso). Envía email de confirmación. */
export const releaseSlots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reservationIds } = req.body as { reservationIds: number[] };
    const userId = parseInt(req.user.id, 10);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const reservations = await prisma.reservation.findMany({
      where: { id: { in: reservationIds }, userId },
      include: { schedule: true },
    });

    const toCancel: typeof reservations = [];
    for (const r of reservations) {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      if (d > now && r.status !== 'CANCELLED' && r.status !== 'COMPLETED') toCancel.push(r);
    }

    if (toCancel.length === 0) {
      sendMessage(res, 'RESERVATION_RELEASE_NONE_VALID');
      return;
    }

    await prisma.reservation.updateMany({
      where: { id: { in: toCancel.map((r) => r.id) } },
      data: { status: 'CANCELLED', updatedAt: new Date() },
    });

    const userForEmail = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (userForEmail?.email) {
      await sendReleaseConfirmationEmail(userForEmail.email, {
        userName: userForEmail.name || 'Usuario',
        datesList: toCancel.map((r) => toDateString(r.date)).join(', '),
      });
    }

    sendMessage(res, 'RESERVATION_RELEASED', {
      releasedCount: toCancel.length,
      dates: toCancel.map((r) => toDateString(r.date)),
    });
  } catch (error) {
    sendMessage(res, 'RESERVATION_CANCEL_ERROR');
  }
};

// Cancelar una reserva (usuario, admin)
export const cancelReservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // Verificar permisos
    if (req.user.role === 'USER' && reservation.userId !== parseInt(req.user.id)) {
      sendMessage(res, 'RESERVATION_CANCEL_INSUFFICIENT_PERMISSIONS');
      return;
    }
    
    // No permitir cancelar una reserva ya completada
    if (reservation.status === 'COMPLETED') {
      sendMessage(res, 'RESERVATION_CANNOT_CANCEL_COMPLETED');
      return;
    }
    
    // Actualizar estado de la reserva
    const updatedReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });
    
    sendMessage(res, 'RESERVATION_CANCELLED', updatedReservation);
  } catch (error) {
    sendMessage(res, 'RESERVATION_CANCEL_ERROR');
  }
};

// Confirmar pago de una reserva (admin/tesorero)
export const confirmPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;
    
    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // No permitir confirmar pago de una reserva cancelada
    if (reservation.status === 'CANCELLED') {
      sendMessage(res, 'RESERVATION_CANNOT_CONFIRM_CANCELLED');
      return;
    }
    
    // Crear registro de pago
    await prisma.paymentRecord.create({
      data: {
        reservationId: Number(id),
        amount: Number(amount),
        paymentMethod,
        confirmedById: parseInt(req.user.id),
      },
    });
    
    // Actualizar reserva
    await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        isPaid: true,
        paymentDate: new Date(),
        paymentConfirmedBy: parseInt(req.user.id),
        status: 'CONFIRMED',
        updatedAt: new Date(),
      },
    });
    
    sendMessage(res, 'RESERVATION_PAYMENT_CONFIRMED');
  } catch (error) {
    sendMessage(res, 'RESERVATION_PAYMENT_ERROR');
  }
};

// Marcar reserva como completada (admin)
export const completeReservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Obtener la reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });
    
    if (!reservation) {
      sendMessage(res, 'RESERVATION_NOT_FOUND');
      return;
    }
    
    // No permitir completar una reserva cancelada
    if (reservation.status === 'CANCELLED') {
      sendMessage(res, 'RESERVATION_CANNOT_COMPLETE_CANCELLED');
      return;
    }
    
    // Actualizar estado de la reserva
    await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });
    
    sendMessage(res, 'RESERVATION_COMPLETED');
  } catch (error) {
    sendMessage(res, 'RESERVATION_COMPLETE_ERROR');
  }
};

// --- Admin: Registro Piscina ---

/** GET calendario admin por mes: cupos tomados vs capacidad (x/y) por día. */
export const getAdminCalendar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { monthYear } = req.query as { monthYear: string };
    const [y, m] = monthYear.split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) {
      sendMessage(res, 'RESERVATION_MISSING_AVAILABILITY_DATA');
      return;
    }
    const monthStart = new Date(y, m - 1, 1);
    const monthEnd = new Date(y, m, 0);

    const schedules = await prisma.swimmingSchedule.findMany({
      where: { dayOfWeek: { in: [1, 3, 5] }, isActive: true },
      orderBy: { dayOfWeek: 'asc' },
    });
    const availabilities = await prisma.poolDayAvailability.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
      include: { schedule: true },
    });

    const days: { date: string; dayOfWeek: number; scheduleId: number; reserved: number; capacity: number; label: string }[] = [];
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const d = new Date(y, m - 1, day);
      const dow = d.getDay();
      if (dow !== 1 && dow !== 3 && dow !== 5) continue;
      const schedule = schedules.find((s) => s.dayOfWeek === dow);
      if (!schedule) continue;

      const dayStart = new Date(y, m - 1, day, 0, 0, 0, 0);
      const dayEnd = new Date(y, m - 1, day, 23, 59, 59, 999);
      const reserved = await prisma.reservation.count({
        where: { scheduleId: schedule.id, date: { gte: dayStart, lte: dayEnd }, status: { not: 'CANCELLED' } },
      });
      const availability = availabilities.find((a) => a.scheduleId === schedule.id && toDateString(a.date) === toDateString(d));
      const capacity = availability ? (availability.capacityOverride ?? schedule.maxCapacity) : schedule.maxCapacity;

      days.push({
        date: toDateString(d),
        dayOfWeek: dow,
        scheduleId: schedule.id,
        reserved,
        capacity,
        label: `${reserved}/${capacity}`,
      });
    }

    sendMessage(res, 'RESERVATION_ADMIN_CALENDAR_RETRIEVED', { monthYear, days, schedules });
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
};

/** POST aperturar mes siguiente: marcar días disponibles para reserva. Solo ADMIN y TREASURER. */
export const openNextMonth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { dates: dateStrings } = req.body as { dates: string[] };
    const userId = parseInt(req.user.id, 10);
    const { start: nextStart, end: nextEnd } = getNextMonthRange();

    const schedules = await prisma.swimmingSchedule.findMany({
      where: { dayOfWeek: { in: [1, 3, 5] }, isActive: true },
    });
    const scheduleByDay: Record<number, (typeof schedules)[0]> = {};
    for (const s of schedules) scheduleByDay[s.dayOfWeek] = s;

    const toCreate: { date: Date; scheduleId: number }[] = [];
    for (const dateStr of dateStrings) {
      const d = new Date(dateStr + 'T12:00:00');
      if (isNaN(d.getTime()) || d < nextStart || d > nextEnd) continue;
      const dow = d.getDay();
      if (dow !== 1 && dow !== 3 && dow !== 5) continue;
      const schedule = scheduleByDay[dow];
      if (!schedule) continue;
      toCreate.push({ date: d, scheduleId: schedule.id });
    }

    await prisma.$transaction(
      toCreate.map(({ date, scheduleId }) =>
        prisma.poolDayAvailability.upsert({
          where: { date_scheduleId: { date, scheduleId } },
          create: { date, scheduleId, isAvailable: true, createdById: userId },
          update: { isAvailable: true },
        })
      )
    );

    sendMessage(res, 'RESERVATION_MONTH_OPENED', { openedCount: toCreate.length, dates: toCreate.map(({ date }) => toDateString(date)) });
  } catch (error) {
    sendMessage(res, 'RESERVATION_CREATE_ERROR');
  }
};

/** POST cancelar días (admin): desmarca disponibilidad y crea reembolsos para reservas afectadas. */
export const cancelDays = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { dates: dateStrings } = req.body as { dates: string[] };
    const schedules = await prisma.swimmingSchedule.findMany({
      where: { dayOfWeek: { in: [1, 3, 5] }, isActive: true },
    });
    const scheduleByDay: Record<number, (typeof schedules)[0]> = {};
    for (const s of schedules) scheduleByDay[s.dayOfWeek] = s;

    const toCancel: { date: Date; scheduleId: number }[] = [];
    for (const dateStr of dateStrings) {
      const d = new Date(dateStr + 'T12:00:00');
      if (isNaN(d.getTime())) continue;
      const dow = d.getDay();
      const schedule = scheduleByDay[dow];
      if (!schedule) continue;
      toCancel.push({ date: d, scheduleId: schedule.id });
    }

    const affectedReservations = await prisma.reservation.findMany({
      where: {
        status: { not: 'CANCELLED' },
        OR: toCancel.map(({ date, scheduleId }) => {
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);
          return { scheduleId, date: { gte: dayStart, lte: dayEnd } };
        }),
      },
      include: { user: { select: { socio: true } } },
    });

    await prisma.$transaction(async (tx) => {
      for (const { date, scheduleId } of toCancel) {
        await tx.poolDayAvailability.updateMany({
          where: { date, scheduleId },
          data: { isAvailable: false },
        });
      }
      for (const res of affectedReservations) {
        await tx.reservation.update({ where: { id: res.id }, data: { status: 'CANCELLED', updatedAt: new Date() } });
        const amount = res.user.socio ? RESERVATION_PRICES.MEMBER : RESERVATION_PRICES.NON_MEMBER;
        await tx.cancellationRefund.create({
          data: { userId: res.userId, reservationId: res.id, amount, status: 'PENDING' },
        });
      }
    });

    sendMessage(res, 'RESERVATION_DAYS_CANCELLED', { cancelledDays: toCancel.length, affectedReservations: affectedReservations.length });
  } catch (error) {
    sendMessage(res, 'RESERVATION_CANCEL_ERROR');
  }
};

/** PATCH aumentar cupos por día (capacityOverride). Solo mes actual. */
export const updateDayCapacity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { date: dateStr, scheduleId, capacityOverride } = req.body as { date: string; scheduleId: number; capacityOverride: number };
    const d = new Date(dateStr + 'T12:00:00');
    if (isNaN(d.getTime()) || capacityOverride < 0) {
      sendMessage(res, 'RESERVATION_MISSING_AVAILABILITY_DATA');
      return;
    }
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    if (d < monthStart || d > monthEnd) {
      sendMessage(res, 'RESERVATION_INVALID_DATES');
      return;
    }

    const updated = await prisma.poolDayAvailability.upsert({
      where: { date_scheduleId: { date: d, scheduleId } },
      create: { date: d, scheduleId, capacityOverride, isAvailable: true, createdById: parseInt(req.user.id, 10) },
      update: { capacityOverride },
    });

    sendMessage(res, 'RESERVATION_CAPACITY_UPDATED', updated);
  } catch (error) {
    sendMessage(res, 'RESERVATION_FETCH_ERROR');
  }
}; 