# Sistema de Reservas de Piscina - Lineamientos Técnicos Completos

## 📋 **RESUMEN EJECUTIVO**

Esta guía detalla la implementación completa del sistema de reservas de piscina para el Club de Aguas Abiertas Chiloé, evolucionando desde la base existente hacia un sistema robusto que soporte períodos de reserva diferenciados, gestión avanzada de pagos, y administración completa de disponibilidad.

### **🎯 Objetivos del MVP**
1. **Gestión Avanzada de Disponibilidad**: Períodos configurables para socios/no-socios
2. **Reservas Múltiples con Acompañantes**: Selección de múltiples fechas y gestión de terceros
3. **Administración de Pagos**: Panel completo para tesoreros con control de estados
4. **Sistema de Cancelación Inteligente**: Liberación automática de cupos
5. **Notificaciones Automáticas**: Confirmaciones y alertas por email

---

## 🏗️ **ESTADO ACTUAL vs PROPUESTO**

### **✅ FUNCIONALIDADES EXISTENTES (Base Sólida)**

**Modelos de Base de Datos:**
- ✅ `SwimmingSchedule` - Horarios base semanales
- ✅ `Reservation` - Reservas individuales  
- ✅ `PaymentRecord` - Registro de pagos
- ✅ `ReservationStatus` - Estados (PENDING, CONFIRMED, CANCELLED, COMPLETED)

**Controllers Existentes:**
- ✅ `reservationController.ts` - CRUD básico de reservas
- ✅ `scheduleController.ts` - Gestión de horarios y disponibilidad
- ✅ Verificación de capacidad por horario
- ✅ Validación de reservas duplicadas
- ✅ Control de horarios activos/inactivos

**Rutas API Configuradas:**
- ✅ `GET /api/reservations/my-reservations` - Reservas del usuario
- ✅ `POST /api/reservations` - Crear reserva individual
- ✅ `GET /api/schedules` - Lista de horarios
- ✅ `GET /api/schedules/availability` - Disponibilidad básica

### **🚧 FUNCIONALIDADES A DESARROLLAR**

**Gestión Avanzada:**
- ❌ Períodos configurables de reserva (socios vs no-socios)
- ❌ Bloqueo de fechas específicas por eventos/feriados
- ❌ Reservas múltiples en batch
- ❌ Sistema de acompañantes
- ❌ Cálculo automático de precios diferenciados

**Administración:**
- ❌ Panel avanzado de gestión de pagos
- ❌ Exportación de datos (CSV/Excel)
- ❌ Edición manual de reservas
- ❌ Sistema de auditoría de cambios

**UX/Notificaciones:**
- ❌ Calendario visual de disponibilidad
- ❌ Emails de confirmación automáticos
- ❌ Sistema de recordatorios

---

## 🗃️ **ARQUITECTURA DE BASE DE DATOS (EVOLUTIVA)**

### **MODELOS EXISTENTES A MODIFICAR/EXTENDER**

#### **1. SwimmingSchedule (Modificar)**
```prisma
model SwimmingSchedule {
  id           Int           @id @default(autoincrement())
  dayOfWeek    Int
  startTime    DateTime
  endTime      DateTime
  maxCapacity  Int
  laneCount    Int
  isActive     Boolean       @default(true)
  
  // ⭐ NUEVOS CAMPOS NECESARIOS
  isEnabledThisMonth Boolean  @default(true)  @map("is_enabled_this_month")
  monthYear          String?                  @map("month_year") // "2024-03"
  memberPrice        Float?                   @map("member_price")
  nonMemberPrice     Float?                   @map("non_member_price")
  description        String?                  // "Entrenamiento libre", "Técnica"
  
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  reservations Reservation[]
  blockDates   ScheduleBlockDate[] // ⭐ NUEVA RELACIÓN

  @@map("swimming_schedules")
  @@schema("public")
}
```

#### **2. Reservation (Modificar)**
```prisma
model Reservation {
  id                 Int               @id @default(autoincrement())
  date               DateTime
  userId             Int               @map("user_id")
  scheduleId         Int               @map("schedule_id")
  status             ReservationStatus @default(PENDING)
  isPaid             Boolean           @default(false) @map("is_paid")
  paymentDate        DateTime?         @map("payment_date")
  paymentConfirmedBy Int?              @map("payment_confirmed_by")
  
  // ⭐ NUEVOS CAMPOS NECESARIOS
  totalAmount        Float?            @map("total_amount")  // Cálculo automático
  userType          UserType          @default(MEMBER) @map("user_type") // MEMBER/NON_MEMBER
  notes             String?           // Notas del usuario o admin
  batchId           String?           @map("batch_id") // Para reservas múltiples
  
  createdAt          DateTime          @default(now()) @map("created_at")
  updatedAt          DateTime          @updatedAt @map("updated_at")
  
  // Relaciones existentes
  paymentRecords     PaymentRecord[]
  treasurer          User?             @relation("PaymentConfirmations", fields: [paymentConfirmedBy], references: [id])
  schedule           SwimmingSchedule  @relation(fields: [scheduleId], references: [id])
  user               User              @relation(fields: [userId], references: [id])
  
  // ⭐ NUEVAS RELACIONES
  companions         ReservationCompanion[] // Acompañantes

  @@index([date, scheduleId])
  @@index([batchId]) // ⭐ Para consultas de reservas múltiples
  @@index([userType]) // ⭐ Para filtros por tipo de usuario
  @@map("reservations")
  @@schema("public")
}
```

### **NUEVOS MODELOS REQUERIDOS**

#### **3. ReservationCompanion (Nuevo)**
```prisma
model ReservationCompanion {
  id            Int          @id @default(autoincrement())
  reservationId Int          @map("reservation_id")
  fullName      String       @map("full_name")
  email         String?      // Email opcional del acompañante
  phone         String?      // Teléfono opcional
  createdAt     DateTime     @default(now()) @map("created_at")
  reservation   Reservation  @relation(fields: [reservationId], references: [id], onDelete: Cascade)

  @@map("reservation_companions")
  @@schema("public")
}
```

#### **4. ScheduleBlockDate (Nuevo)**
```prisma
model ScheduleBlockDate {
  id           Int              @id @default(autoincrement())
  scheduleId   Int              @map("schedule_id")
  blockedDate  DateTime         @map("blocked_date")
  reason       String?          // "Feriado", "Evento especial", etc.
  blockedBy    Int              @map("blocked_by")
  createdAt    DateTime         @default(now()) @map("created_at")
  
  schedule     SwimmingSchedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
  admin        User             @relation("ScheduleBlocks", fields: [blockedBy], references: [id])

  @@unique([scheduleId, blockedDate]) // No duplicar bloqueos
  @@map("schedule_block_dates")
  @@schema("public")
}
```

#### **5. ReservationPeriod (Nuevo)**
```prisma
model ReservationPeriod {
  id            Int      @id @default(autoincrement())
  name          String   // "Período Socios", "Apertura General"
  description   String?  // Descripción del período
  startDate     DateTime @map("start_date")
  endDate       DateTime @map("end_date")
  allowedUsers  Json     // Array de tipos: ["MEMBER"] o ["MEMBER", "NON_MEMBER"]
  isActive      Boolean  @default(true) @map("is_active")
  createdBy     Int      @map("created_by")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  admin         User     @relation("CreatedPeriods", fields: [createdBy], references: [id])

  @@map("reservation_periods")
  @@schema("public")
}
```

#### **6. ENUMS Adicionales**
```prisma
enum UserType {
  MEMBER     @map("member")
  NON_MEMBER @map("non_member")
  
  @@schema("public")
}
```

#### **7. User (Modificar - Agregar Relaciones)**
```prisma
model User {
  // ... campos existentes ...
  
  // ⭐ NUEVAS RELACIONES
  createdPeriods    ReservationPeriod[] @relation("CreatedPeriods")
  blockedSchedules  ScheduleBlockDate[] @relation("ScheduleBlocks")
  
  // ... resto de relaciones existentes ...
}
```

---

## 🚀 **ENDPOINTS DE API (EVOLUTIVOS)**

### **FASE 1: GESTIÓN AVANZADA DE DISPONIBILIDAD**

#### **Endpoints de Administración de Horarios (ADMIN)**

##### **PUT /api/schedules/:scheduleId/monthly-config**
**Propósito**: Configurar disponibilidad mensual de un horario
```typescript
Body:
{
  monthYear: "2024-03",         // Mes a configurar
  isEnabled: true,              // Habilitar/deshabilitar
  memberPrice: 5000,            // Precio para socios
  nonMemberPrice: 8000,         // Precio para no socios  
  description?: "Entrenamiento libre"
}

Response:
{
  success: true,
  message: "Configuración mensual actualizada",
  data: SwimmingSchedule
}
```

##### **POST /api/schedules/:scheduleId/block-dates**
**Propósito**: Bloquear fechas específicas de un horario
```typescript
Body:
{
  dates: ["2024-03-25", "2024-03-26"], // Fechas a bloquear
  reason: "Feriado Semana Santa"
}

Response:
{
  success: true,
  message: "Fechas bloqueadas correctamente",
  data: ScheduleBlockDate[]
}
```

##### **GET /api/schedules/monthly-overview**
**Propósito**: Vista completa de disponibilidad mensual para admin
```typescript
Query Parameters:
- monthYear: "2024-03"

Response:
{
  success: true,
  message: "Vista mensual obtenida",
  data: {
    schedules: SwimmingSchedule[],
    blockDates: ScheduleBlockDate[],
    reservationCounts: { [scheduleId]: { [date]: count } },
    activePeriods: ReservationPeriod[]
  }
}
```

#### **Endpoints de Períodos de Reserva (ADMIN)**

##### **POST /api/reservation-periods**
**Propósito**: Crear nuevo período de reserva
```typescript
Body:
{
  name: "Período Socios Marzo",
  description: "Reservas exclusivas para socios",
  startDate: "2024-02-25T00:00:00Z",
  endDate: "2024-03-05T23:59:59Z",
  allowedUsers: ["MEMBER"]
}

Response:
{
  success: true,
  message: "Período de reserva creado",
  data: ReservationPeriod
}
```

##### **GET /api/reservation-periods/current**
**Propósito**: Obtener período activo actual
```typescript
Response:
{
  success: true,
  message: "Período actual obtenido",
  data: {
    activePeriod: ReservationPeriod | null,
    userCanReserve: boolean,    // Si el usuario actual puede reservar
    nextPeriod?: ReservationPeriod
  }
}
```

---

### **FASE 2: RESERVAS MÚLTIPLES Y ACOMPAÑANTES**

#### **Endpoints de Reserva Avanzada (USER)**

##### **POST /api/reservations/batch**
**Propósito**: Crear múltiples reservas en una transacción
```typescript
Body:
{
  reservations: [
    {
      scheduleId: 1,
      date: "2024-03-25"
    },
    {
      scheduleId: 2, 
      date: "2024-03-27"
    }
  ],
  companions: [
    {
      fullName: "Juan Pérez",
      email: "juan@email.com",
      phone: "+56912345678"
    }
  ],
  notes?: "Reserva familiar para toda la semana"
}

Response:
{
  success: true,
  message: "Reservas creadas correctamente", 
  data: {
    batchId: "batch-uuid-123",
    reservations: Reservation[],
    totalAmount: 25000,
    paymentInstructions: {
      accountNumber: "12345678-9",
      bank: "Banco Estado",
      accountHolder: "Club Aguas Abiertas Chiloé"
    }
  }
}
```

##### **GET /api/reservations/availability-calendar**
**Propósito**: Obtener calendario de disponibilidad visual
```typescript
Query Parameters:
- monthYear: "2024-03"
- userType?: "MEMBER" | "NON_MEMBER" (detectar automáticamente si no se especifica)

Response:
{
  success: true,
  message: "Calendario de disponibilidad obtenido",
  data: {
    calendar: {
      [date: string]: {
        [scheduleId: number]: {
          available: boolean,
          capacity: number,
          reserved: number,
          remaining: number,
          price: number,
          isBlocked: boolean,
          blockReason?: string
        }
      }
    },
    schedules: SwimmingSchedule[],
    userCanReserve: boolean,
    activePeriod: ReservationPeriod | null
  }
}
```

##### **GET /api/reservations/batch/:batchId**
**Propósito**: Obtener detalles de reservas múltiples
```typescript
Response:
{
  success: true,
  message: "Lote de reservas obtenido",
  data: {
    batchId: string,
    reservations: Reservation[],
    companions: ReservationCompanion[],
    totalAmount: number,
    isPaid: boolean,
    createdAt: string
  }
}
```

---

### **FASE 3: ADMINISTRACIÓN AVANZADA DE PAGOS**

#### **Endpoints de Gestión de Pagos (ADMIN/TREASURER)**

##### **GET /api/reservations/payment-overview**
**Propósito**: Panel de control de pagos pendientes
```typescript
Query Parameters:
- status?: "PENDING" | "PAID" | "OVERDUE"
- monthYear?: "2024-03"
- limit?: number
- offset?: number

Response:
{
  success: true,
  message: "Resumen de pagos obtenido",
  data: {
    pendingPayments: {
      userId: number,
      userName: string,
      userEmail: string,
      reservationCount: number,
      totalAmount: number,
      oldestReservation: string,
      batchIds: string[]
    }[],
    summary: {
      totalPending: number,
      totalAmount: number,
      overdueCount: number
    },
    pagination: {
      total: number,
      hasMore: boolean
    }
  }
}
```

##### **PUT /api/reservations/batch/:batchId/confirm-payment**
**Propósito**: Marcar lote completo como pagado
```typescript
Body:
{
  paymentMethod: "TRANSFER" | "CASH" | "CARD",
  amount: 25000,
  notes?: "Transferencia recibida el 25/03"
}

Response:
{
  success: true,
  message: "Pago confirmado para el lote",
  data: {
    updatedReservations: Reservation[],
    paymentRecord: PaymentRecord
  }
}
```

##### **PUT /api/reservations/:reservationId/edit**
**Propósito**: Edición manual de reserva por admin
```typescript
Body:
{
  date?: "2024-03-26",           // Cambiar fecha
  scheduleId?: 2,                // Cambiar horario
  notes?: "Cambio por feriado",
  companions?: ReservationCompanion[]
}

Response:
{
  success: true,
  message: "Reserva editada correctamente",
  data: Reservation
}
```

##### **GET /api/reservations/export**
**Propósito**: Exportar datos de reservas
```typescript
Query Parameters:
- format: "CSV" | "EXCEL"
- monthYear?: "2024-03"
- status?: ReservationStatus
- includeCompanions?: boolean

Response:
{
  success: true,
  message: "Datos exportados",
  data: {
    downloadUrl: string,    // URL temporal del archivo
    filename: string,
    expiresAt: string
  }
}
```

---

### **FASE 4: CANCELACIÓN Y LIBERACIÓN**

##### **DELETE /api/reservations/:reservationId/cancel**
**Propósito**: Cancelar reserva individual (solo usuarios)
```typescript
Body:
{
  reason?: "No puedo asistir"
}

Response:
{
  success: true,
  message: "Reserva cancelada y cupo liberado",
  data: {
    cancelledReservation: Reservation,
    refundEligible: boolean,    // Si aplica reembolso
    liberatedCapacity: number
  }
}
```

##### **DELETE /api/reservations/batch/:batchId/cancel**
**Propósito**: Cancelar lote completo de reservas
```typescript
Body:
{
  reason?: "Cambio de planes",
  cancelAll: boolean,          // true = cancelar todas, false = selectivas
  reservationIds?: number[],   // Si cancelAll = false
  allowPartialCancel?: boolean // ⭐ NUEVA: Permitir cancelación parcial
}

Response:
{
  success: true,
  message: "Lote de reservas cancelado",
  data: {
    cancelledCount: number,
    liberatedCapacity: number,
    remainingReservations: Reservation[],
    batchActive: boolean       // ⭐ NUEVA: Si el batch sigue activo
  }
}
```

---

### **FASE 5: NOTIFICACIONES Y COMUNICACIÓN**

##### **POST /api/reservations/send-reminders**
**Propósito**: Enviar recordatorios masivos (ADMIN)
```typescript
Body:
{
  type: "PAYMENT_REMINDER" | "RESERVATION_REMINDER",
  targetUsers?: number[],      // IDs específicos o null para todos
  scheduledFor?: string        // Envío programado
}

Response:
{
  success: true,
  message: "Recordatorios programados",
  data: {
    recipientCount: number,
    scheduledFor: string
  }
}
```

---

## 📧 **SISTEMA DE NOTIFICACIONES**

### **Templates de Email Requeridos**

#### **1. Confirmación de Reserva**
```html
<!-- api/src/services/email/templates/reservationConfirmation.html -->
Asunto: ✅ Reserva Confirmada - Club Aguas Abiertas Chiloé

Hola {{userName}},

Tu reserva ha sido confirmada:

📅 **Fechas Reservadas:**
{{#each reservations}}
- {{date}} a las {{schedule.startTime}} - {{schedule.endTime}}
{{/each}}

👥 **Acompañantes:** {{companions.length}}
{{#each companions}}
- {{fullName}}
{{/each}}

💰 **Total a Pagar:** ${{totalAmount}} CLP

**Datos para Transferencia:**
- Banco: Banco Estado  
- Cuenta: 12345678-9
- Titular: Club de Aguas Abiertas Chiloé
- Monto: ${{totalAmount}}

⚠️ **Importante:** Debes realizar el pago antes del {{paymentDeadline}}
```

#### **2. Recordatorio de Pago**
```html
<!-- api/src/services/email/templates/paymentReminder.html -->
Asunto: 💳 Recordatorio de Pago - Reservas Pendientes

Hola {{userName}},

Tienes reservas pendientes de pago:

📋 **Resumen:**
- Cantidad de reservas: {{reservationCount}}
- Monto total: ${{totalAmount}} CLP
- Fecha límite: {{paymentDeadline}}

🔗 Ver detalles: {{reservationUrl}}
```

#### **3. Confirmación de Pago (Admin)**
```html
<!-- api/src/services/email/templates/adminPaymentNotification.html -->
Asunto: 💰 Nuevo Pago Registrado

Nueva reserva pagada:

👤 **Usuario:** {{userName}} ({{userEmail}})
💰 **Monto:** ${{amount}} CLP
📅 **Reservas:** {{reservationCount}}
🏦 **Método:** {{paymentMethod}}

Panel de administración: {{adminUrl}}
```

---

## 🎨 **COMPONENTES DE FRONTEND REQUERIDOS**

### **Componentes de Usuario**

#### **1. ReservationCalendar.tsx**
```typescript
interface ReservationCalendarProps {
  monthYear: string;
  onDateSelect: (date: string, scheduleId: number) => void;
  selectedDates: Array<{date: string, scheduleId: number}>;
  availabilityData: CalendarAvailability;
  userType: 'MEMBER' | 'NON_MEMBER';
}

// Funcionalidades:
// - Vista mensual con colores por disponibilidad
// - Selección múltiple de fechas
// - Tooltips con información detallada
// - Indicadores de precios por tipo de usuario
```

#### **2. BatchReservationForm.tsx**
```typescript
interface BatchReservationFormProps {
  selectedSlots: ReservationSlot[];
  onSubmit: (data: BatchReservationData) => void;
  isLoading: boolean;
}

// Funcionalidades:
// - Resumen de fechas seleccionadas
// - Formulario de acompañantes dinámico
// - Cálculo automático de total
// - Validaciones en tiempo real
```

#### **3. ReservationSummary.tsx**
```typescript
interface ReservationSummaryProps {
  batchId: string;
  reservations: Reservation[];
  companions: ReservationCompanion[];
  totalAmount: number;
  paymentInstructions: PaymentInstructions;
}

// Funcionalidades:
// - Vista detallada de reservas
// - Información de pago
// - Botones de acción (cancelar, editar)
// - Estado de pago visual
```

### **Componentes de Administración**

#### **4. PaymentDashboard.tsx**
```typescript
interface PaymentDashboardProps {
  pendingPayments: PendingPayment[];
  onConfirmPayment: (batchId: string, paymentData: PaymentData) => void;
  onExportData: (filters: ExportFilters) => void;
}

// Funcionalidades:
// - Tabla con filtros avanzados
// - Confirmación masiva de pagos
// - Exportación de datos
// - Métricas en tiempo real
```

#### **5. ScheduleConfigPanel.tsx**
```typescript
interface ScheduleConfigPanelProps {
  schedules: SwimmingSchedule[];
  monthYear: string;
  onUpdateConfig: (scheduleId: number, config: MonthlyConfig) => void;
  onBlockDates: (scheduleId: number, dates: string[], reason: string) => void;
}

// Funcionalidades:
// - Configuración mensual por horario
// - Bloqueo visual de fechas
// - Precios diferenciados
// - Vista previa de cambios
```

---

## 📊 **LÓGICA DE NEGOCIO CRÍTICA**

### **1. Validación de Períodos de Reserva**
```typescript
// api/src/services/reservationService.ts
export class ReservationService {
  async validateReservationPeriod(
    userId: number, 
    requestedDates: string[]
  ): Promise<ValidationResult> {
    
    // 1. Obtener tipo de usuario (socio/no-socio)
    const user = await this.getUserWithProfile(userId);
    const userType = this.determineUserType(user);
    
    // 2. Obtener período activo
    const activePeriod = await this.getActivePeriod();
    
    // 3. Validar si el usuario puede reservar
    if (!activePeriod) {
      throw new Error('No hay períodos de reserva activos');
    }
    
    if (!activePeriod.allowedUsers.includes(userType)) {
      throw new Error('No tienes permisos para reservar en este período');
    }
    
    // 4. Validar fechas dentro del rango permitido
    const withinPeriod = requestedDates.every(date => 
      isWithinInterval(parseISO(date), {
        start: activePeriod.startDate,
        end: activePeriod.endDate
      })
    );
    
    if (!withinPeriod) {
      throw new Error('Algunas fechas están fuera del período de reserva');
    }
    
    return { valid: true, userType, activePeriod };
  }
}
```

### **2. Cálculo Automático de Precios**
```typescript
export class PricingService {
  async calculateBatchPrice(
    reservationData: BatchReservationData,
    userType: UserType
  ): Promise<PriceCalculation> {
    
    let totalAmount = 0;
    const breakdown: PriceBreakdown[] = [];
    
    for (const reservation of reservationData.reservations) {
      const schedule = await prisma.swimmingSchedule.findUnique({
        where: { id: reservation.scheduleId }
      });
      
      if (!schedule) continue;
      
      const price = userType === 'MEMBER' 
        ? schedule.memberPrice || 0
        : schedule.nonMemberPrice || 0;
      
      // ⭐ MEJORADO: Validar límite de acompañantes
      const companionCount = reservationData.companions?.length || 0;
      if (companionCount > BusinessRulesService.RESERVATION_RULES.maxCompanionsPerReservation) {
        throw new Error(`Máximo ${BusinessRulesService.RESERVATION_RULES.maxCompanionsPerReservation} acompañantes por reserva`);
      }
      
      // ⭐ MEJORADO: Validar capacidad total incluyendo acompañantes
      const currentReservations = await prisma.reservation.count({
        where: { 
          scheduleId: reservation.scheduleId,
          date: reservation.date,
          status: { not: 'CANCELLED' }
        }
      });
      
      BusinessRulesService.RESERVATION_RULES.validateTotalCapacity(
        companionCount, 
        schedule, 
        currentReservations
      );
      
      const companionPrice = schedule.nonMemberPrice || 0;
      const slotTotal = price + (companionCount * companionPrice);
      
      totalAmount += slotTotal;
      breakdown.push({
        date: reservation.date,
        scheduleId: reservation.scheduleId,
        basePrice: price,
        companionCount,
        companionPrice: companionPrice * companionCount,
        slotTotal
      });
    }
    
    return { totalAmount, breakdown };
  }
}
```

### **3. Liberación Automática de Cupos**
```typescript
export class CancellationService {
  async cancelReservation(
    reservationId: number,
    userId: number,
    reason?: string
  ): Promise<CancellationResult> {
    
    return await prisma.$transaction(async (tx) => {
      // 1. Verificar que la reserva pertenece al usuario
      const reservation = await tx.reservation.findFirst({
        where: { 
          id: reservationId, 
          userId,
          status: { not: 'CANCELLED' }
        },
        include: { schedule: true }
      });
      
      if (!reservation) {
        throw new Error('Reserva no encontrada o ya cancelada');
      }
      
      // 2. Validar que se puede cancelar (ej: no el mismo día)
      const canCancel = this.validateCancellationPolicy(reservation);
      if (!canCancel.allowed) {
        throw new Error(canCancel.reason);
      }
      
      // 3. Marcar como cancelada
      const cancelled = await tx.reservation.update({
        where: { id: reservationId },
        data: { 
          status: 'CANCELLED',
          notes: reason ? `Cancelado: ${reason}` : 'Cancelado por usuario'
        }
      });
      
      // 4. Calcular nueva disponibilidad
      const newAvailability = await this.calculateAvailability(
        reservation.scheduleId,
        reservation.date,
        tx
      );
      
      // 5. Notificar liberación de cupo (opcional)
      await this.notifyCapacityLiberated(reservation);
      
      return {
        cancelledReservation: cancelled,
        liberatedCapacity: 1,
        newAvailability
      };
    });
  }
}
```

### **4. Validaciones de Negocio Críticas** ⭐ **MEJORAS INTEGRADAS**
```typescript
// api/src/services/businessRulesService.ts
export class BusinessRulesService {
  // ⭐ NUEVA: Validaciones de negocio específicas del club
  static readonly RESERVATION_RULES = {
    // Horario de corte: No reservar mismo día después de las 20:00
    cutoffTime: (date: Date): void => {
      const today = new Date();
      const reservationDate = new Date(date);
      
      if (isSameDay(today, reservationDate) && getHours(today) >= 20) {
        throw new Error('No se puede reservar el mismo día después de las 20:00');
      }
    },
    
    // Límite por usuario: Máximo 3 reservas activas
    maxActiveReservations: 3,
    
    // Cancelación: Mínimo 2 horas antes
    minCancellationTime: 2 * 60 * 60 * 1000, // 2 horas en ms
    
    // Límite de acompañantes por reserva
    maxCompanionsPerReservation: 2,
    
    // Validar capacidad total incluyendo acompañantes
    validateTotalCapacity: (companionCount: number, schedule: SwimmingSchedule, currentReservations: number): void => {
      const totalCapacity = companionCount + 1; // +1 por el usuario principal
      if (currentReservations + totalCapacity > schedule.maxCapacity) {
        throw new Error(`Excede capacidad disponible. Máximo ${schedule.maxCapacity - currentReservations} cupos disponibles`);
      }
    }
  };

  // ⭐ NUEVA: Gestión de batch parcial
  static async handlePartialBatchCancel(
    batchId: string,
    reservationIds: number[],
    allowPartialCancel: boolean = false
  ): Promise<BatchCancelResult> {
    
    if (!allowPartialCancel && reservationIds.length > 0) {
      throw new Error('Cancelación parcial no permitida para este lote');
    }
    
    // Si se permite cancelación parcial, actualizar batch con reservas restantes
    const remainingReservations = await prisma.reservation.findMany({
      where: { 
        batchId,
        id: { notIn: reservationIds },
        status: { not: 'CANCELLED' }
      }
    });
    
    // Si no quedan reservas activas, marcar batch como completado
    if (remainingReservations.length === 0) {
      await prisma.reservation.updateMany({
        where: { batchId },
        data: { batchId: null } // Remover referencia al batch
      });
    }
    
    return {
      cancelledCount: reservationIds.length,
      remainingReservations: remainingReservations.length,
      batchActive: remainingReservations.length > 0
    };
  }
}
```

### **5. Gestión de Archivos de Exportación** ⭐ **MEJORA INTEGRADA**
```typescript
// api/src/services/exportService.ts
export class ExportService {
  async generateExportFile(
    data: any[], 
    format: 'CSV' | 'EXCEL',
    filters: ExportFilters
  ): Promise<ExportResult> {
    
    const filename = `reservations-${Date.now()}-${filters.monthYear || 'all'}.${format.toLowerCase()}`;
    const buffer = await this.generateFileBuffer(data, format);
    
    // ⭐ NUEVA: Usar Supabase Storage para archivos temporales
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('exports')
      .upload(filename, buffer, { 
        upsert: true,
        contentType: format === 'CSV' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    
    if (uploadError) {
      throw new Error(`Error al subir archivo: ${uploadError.message}`);
    }
    
    // ⭐ NUEVA: URL que expira en 1 hora
    const { data: urlData, error: urlError } = await supabase.storage
      .from('exports')
      .createSignedUrl(filename, 3600); // 1 hora
      
    if (urlError) {
      throw new Error(`Error al generar URL: ${urlError.message}`);
    }
    
    return {
      downloadUrl: urlData.signedUrl,
      filename,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      fileSize: buffer.length
    };
  }
}
```

---

## ⚡ **OPTIMIZACIONES DE PERFORMANCE**

### **1. Índices de Base de Datos Específicos**
```sql
-- Optimización para consultas de disponibilidad
CREATE INDEX CONCURRENTLY idx_reservations_date_schedule_status 
ON reservations(date, schedule_id, status) 
WHERE status != 'CANCELLED';

-- Optimización para períodos de reserva
CREATE INDEX CONCURRENTLY idx_reservation_periods_active_dates
ON reservation_periods(is_active, start_date, end_date)
WHERE is_active = true;

-- Optimización para lotes de reserva
CREATE INDEX CONCURRENTLY idx_reservations_batch_user
ON reservations(batch_id, user_id)
WHERE batch_id IS NOT NULL;

-- Optimización para horarios por mes
CREATE INDEX CONCURRENTLY idx_schedules_monthly_enabled
ON swimming_schedules(month_year, is_enabled_this_month)
WHERE is_enabled_this_month = true;
```

### **2. Cache Strategy Mejorado** ⭐ **MEJORA INTEGRADA**
```typescript
// api/src/services/cacheService.ts
export class CacheService {
  // Cache de disponibilidad por 2 minutos (reducido de 5 min)
  async getAvailabilityCalendar(monthYear: string): Promise<CalendarData> {
    const cacheKey = `availability:${monthYear}`;
    
    let cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const data = await this.calculateAvailabilityCalendar(monthYear);
    await redis.setex(cacheKey, 120, JSON.stringify(data)); // 2 minutos
    
    return data;
  }
  
  // ⭐ NUEVA: Invalidar cache al crear/cancelar reservas
  async invalidateAvailabilityCache(dates: string[]): Promise<void> {
    const monthYears = [...new Set(dates.map(date => date.substring(0, 7)))];
    
    for (const monthYear of monthYears) {
      await redis.del(`availability:${monthYear}`);
    }
  }
  
  // ⭐ NUEVA: Keep-alive para evitar cold starts en Render.com
  async keepApiAlive(): Promise<void> {
    setInterval(async () => {
      try {
        await fetch('https://api.aguasabiertaschiloe.cl/health');
      } catch (error) {
        console.warn('Keep alive ping failed:', error);
      }
    }, 10 * 60 * 1000); // 10 minutos
  }
}
```

### **2. Cache Strategy**
```typescript
// api/src/services/cacheService.ts
export class CacheService {
  // Cache de disponibilidad por 5 minutos
  async getAvailabilityCalendar(monthYear: string): Promise<CalendarData> {
    const cacheKey = `availability:${monthYear}`;
    
    let cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const data = await this.calculateAvailabilityCalendar(monthYear);
    await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 minutos
    
    return data;
  }
  
  // Invalidar cache al crear/cancelar reservas
  async invalidateAvailabilityCache(dates: string[]): Promise<void> {
    const monthYears = [...new Set(dates.map(date => date.substring(0, 7)))];
    
    for (const monthYear of monthYears) {
      await redis.del(`availability:${monthYear}`);
    }
  }
}
```

---

## 🔧 **PLAN DE IMPLEMENTACIÓN POR FASES**

### **FASE 1: EXTENSIÓN DE MODELOS Y API BASE** (Semana 1-2)
- [ ] **1.1** Migración de base de datos - Nuevos campos y modelos
- [ ] **1.2** Actualizar modelos Prisma existentes
- [ ] **1.3** Crear servicios base (ReservationService, PricingService, BusinessRulesService) 
- [ ] **1.4** Endpoints de configuración de horarios mensuales
- [ ] **1.5** Sistema de bloqueo de fechas específicas
- [ ] **1.6** API de períodos de reserva (CRUD)
- [ ] **1.7** Implementar validaciones de negocio críticas
- [ ] **1.8** Configurar keep-alive para evitar cold starts

### **FASE 2: RESERVAS MÚLTIPLES** (Semana 3-4)
- [ ] **2.1** Endpoint de reserva en lote (/batch)
- [ ] **2.2** Sistema de acompañantes
- [ ] **2.3** Cálculo automático de precios
- [ ] **2.4** Calendario de disponibilidad visual (API)
- [ ] **2.5** Validaciones de períodos de reserva
- [ ] **2.6** Testing completo de lógica de negocio

### **FASE 3: FRONTEND DE USUARIO** (Semana 5-6)
- [ ] **3.1** Componente ReservationCalendar
- [ ] **3.2** Formulario de reserva múltiple
- [ ] **3.3** Sistema de acompañantes dinámico
- [ ] **3.4** Resumen de reserva y pago
- [ ] **3.5** Vista de mis reservas mejorada
- [ ] **3.6** Sistema de cancelación

### **FASE 4: PANEL ADMINISTRATIVO** (Semana 7-8)
- [ ] **4.1** Dashboard de pagos pendientes
- [ ] **4.2** Confirmación masiva de pagos
- [ ] **4.3** Edición manual de reservas
- [ ] **4.4** Panel de configuración de horarios
- [ ] **4.5** Gestión de períodos de reserva
- [ ] **4.6** Sistema de exportación (CSV/Excel) con Supabase Storage
- [ ] **4.7** Gestión de cancelaciones parciales de batch

### **FASE 5: NOTIFICACIONES Y PULIMIENTO** (Semana 9-10)
- [ ] **5.1** Templates de email completos
- [ ] **5.2** Sistema de recordatorios automáticos
- [ ] **5.3** Notificaciones a administradores
- [ ] **5.4** Optimizaciones de performance
- [ ] **5.5** Testing end-to-end completo
- [ ] **5.6** Documentación de usuario

---

## 🧪 **ESTRATEGIA DE TESTING**

### **Testing Backend**
```typescript
// api/src/__tests__/reservation.test.ts
describe('Sistema de Reservas Avanzado', () => {
  
  describe('Períodos de Reserva', () => {
    test('Solo socios pueden reservar en período exclusivo', async () => {
      // Setup: Crear período solo para socios
      // Test: Usuario no-socio intenta reservar
      // Assert: Debe fallar con error específico
    });
    
    test('Liberación automática en período general', async () => {
      // Setup: Cambiar a período general
      // Test: Usuario no-socio puede reservar
      // Assert: Reserva exitosa
    });
  });
  
  describe('Reservas Múltiples', () => {
    test('Crear lote de reservas con acompañantes', async () => {
      // Setup: Datos de reserva múltiple
      // Test: POST /api/reservations/batch
      // Assert: Todas las reservas creadas correctamente
    });
    
    test('Cálculo correcto de precios diferenciados', async () => {
      // Setup: Reservas de socio y no-socio
      // Test: Cálculo automático
      // Assert: Precios aplicados correctamente
    });
  });
  
  describe('Administración de Pagos', () => {
    test('Confirmación masiva de pagos', async () => {
      // Setup: Múltiples reservas pendientes
      // Test: Marcar lote como pagado
      // Assert: Todas actualizadas correctamente
    });
  });
});
```

### **Testing Frontend**
```typescript
// frontend/__tests__/ReservationCalendar.test.tsx
describe('ReservationCalendar Component', () => {
  test('Muestra disponibilidad diferenciada por tipo de usuario', () => {
    // Setup: Mock data con precios diferentes
    // Test: Render del calendario
    // Assert: Precios correctos por tipo de usuario
  });
  
  test('Selección múltiple de fechas funciona', () => {
    // Setup: Calendario renderizado
    // Test: Seleccionar múltiples fechas
    // Assert: Estado actualizado correctamente
  });
  
  test('Validación de períodos de reserva', () => {
    // Setup: Usuario no-socio en período exclusivo
    // Test: Intentar seleccionar fecha
    // Assert: Debe mostrar error/deshabilitado
  });
});
```

---

## 📋 **CHECKLIST DE ENTREGA MVP**

### **Funcionalidades Core**
- [ ] ✅ Períodos configurables de reserva (socios/no-socios)
- [ ] ✅ Reservas múltiples en una transacción
- [ ] ✅ Sistema de acompañantes con datos personales
- [ ] ✅ Cálculo automático de precios diferenciados
- [ ] ✅ Bloqueo de fechas específicas por eventos
- [ ] ✅ Panel administrativo de gestión de pagos
- [ ] ✅ Sistema de cancelación con liberación de cupos
- [ ] ✅ Notificaciones automáticas por email
- [ ] ⭐ **NUEVO**: Validaciones de negocio específicas del club
- [ ] ⭐ **NUEVO**: Gestión de cancelaciones parciales de batch
- [ ] ⭐ **NUEVO**: Límites de acompañantes por reserva
- [ ] ⭐ **NUEVO**: Sistema de exportación con URLs temporales

### **UX/UI**
- [ ] ✅ Calendario visual de disponibilidad
- [ ] ✅ Selección múltiple intuitiva de fechas
- [ ] ✅ Resumen claro de reserva y costos
- [ ] ✅ Dashboard administrativo funcional
- [ ] ✅ Estados visuales claros (disponible/completo/bloqueado)
- [ ] ✅ Responsive design completo

### **Performance y Seguridad**
- [ ] ✅ Índices optimizados para consultas frecuentes
- [ ] ✅ Cache inteligente de disponibilidad
- [ ] ✅ Validaciones robustas de autorización
- [ ] ✅ Transacciones atómicas para operaciones críticas
- [ ] ✅ Rate limiting en endpoints públicos
- [ ] ✅ Keep-alive para evitar cold starts en Render.com
- [ ] ✅ Invalidación inteligente de cache

### **Integración**
- [ ] ✅ Integración completa con sistema de autenticación existente
- [ ] ✅ Notificaciones email usando servicio existente (Resend)
- [ ] ✅ Exportación de datos para gestión externa
- [ ] ✅ API documentation completa

---

## 🎯 **MÉTRICAS DE ÉXITO**

### **Técnicas**
- **Performance**: Calendario de disponibilidad carga en <2 segundos
- **Escalabilidad**: Soporte para 100+ reservas simultáneas  
- **Reliability**: 99.9% uptime durante operación
- **UX**: Flujo de reserva completable en <3 minutos
- ⭐ **NUEVO**: Cold start mitigation <30 segundos con keep-alive
- ⭐ **NUEVO**: Cache hit rate >80% para consultas de disponibilidad

### **Funcionales**  
- **Adoptación**: 80% de usuarios usan reservas múltiples
- **Eficiencia Admin**: 50% reducción en tiempo de gestión de pagos
- **Satisfacción**: 90% de reservas completadas sin problemas
- **Automatización**: 95% de notificaciones enviadas automáticamente
- ⭐ **NUEVO**: <5% de cancelaciones por conflictos de capacidad
- ⭐ **NUEVO**: 100% de exportaciones exitosas con URLs temporales

---

## 🚀 **POST-MVP: ROADMAP FUTURO**

### **Funcionalidades Avanzadas**
1. **App Mobile**: Notificaciones push nativas
2. **Pagos Online**: Integración con WebPay/Flow
3. **Sistema de Créditos**: Compra de paquetes de clases
4. **Analytics Avanzado**: Reportes de uso y tendencias
5. **API Pública**: Integración con apps de terceros
6. **Sistema de Waitlist**: Lista de espera automática

### **Optimizaciones**
1. **Real-time Updates**: WebSockets para disponibilidad en vivo
2. **Machine Learning**: Predicción de demanda
3. **CDN**: Cache geográfico para mejor performance
4. **Microservicios**: Separación de responsabilidades

---

## 📌 Fuente de verdad del plan actual

La especificación funcional y el plan de tareas en vigor están en:

- **[reservas-especificacion.md](reservas-especificacion.md)** — Panel usuario (calendario, liberar cupos, nueva reserva, precios socio/no socio, reembolsos, emails de respaldo) y panel admin (Registro Piscina, apertura mes, cancelación con reembolsos, tesorero puede aperturar). Campo socio editable solo por admin.
- **[reservas-plan-tareas.md](reservas-plan-tareas.md)** — Tareas API y frontend, endpoint de contexto, eliminación de `/app/reservas/nueva`.

Lo que sigue en este documento y **no** está incorporado en ese plan queda como **ideas de desarrollo futuro**.

---

## 🔮 Ideas de desarrollo futuro (no incorporadas en el plan actual)

Resumen de lo descrito en este documento que queda fuera del alcance actual; se puede retomar en fases posteriores:

- **Períodos de reserva** (ReservationPeriod): ventanas configurables solo socios / socios + no socios; no se usa en el flujo actual (apertura por mes y precios fijos 2.000/3.000).
- **Reservas en batch** con `batchId` y **acompañantes** (ReservationCompanion): reserva múltiple en una transacción con datos de terceros; el plan actual es reserva por días con monto único y sin acompañantes.
- **Precios por horario** (memberPrice/nonMemberPrice en SwimmingSchedule): el plan usa precios fijos globales (socio/no socio).
- **Bloqueo de fechas** (ScheduleBlockDate) con motivo: el plan usa “días disponibles por mes” y “cancelar día” con reembolsos, sin modelo de bloqueos con razón.
- **Panel de pagos** avanzado: confirmación masiva por batch, exportación CSV/Excel con URLs temporales, edición manual de reservas; el plan contempla confirmación de pago y Registro Piscina, sin estos extras.
- **Recordatorios automáticos** y notificaciones a administradores (envío programado, etc.); el plan incluye emails de respaldo al usuario (nueva reserva, liberación), no recordatorios ni notificaciones a admin.
- **Validaciones de negocio** detalladas (horario de corte 20:00, máximo 3 reservas activas, 2 horas antes para cancelar, límite de acompañantes, validación de capacidad con acompañantes); el plan aplica reglas más simples (solo fechas futuras para liberar, mes siguiente abierto, etc.).
- **Cache/Redis** e índices específicos de este documento: se implementarán según necesidad; el plan no los exige por defecto.
- **Keep-alive** y optimizaciones de cold start: útiles en producción; fuera del alcance del plan de reservas actual.

**🎉 El sistema actual se implementa según reservas-especificacion.md y reservas-plan-tareas.md. Este documento sirve como referencia técnica y banco de ideas para evoluciones futuras.**