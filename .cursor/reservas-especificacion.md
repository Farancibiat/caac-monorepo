# Especificación funcional: Sistema de Reservas de Piscina

Documento de referencia para el sistema de reservas según requisitos acordados.  
Horarios fijos: **Lunes 21:00**, **Miércoles 8:00**, **Viernes 19:00**. Las reservas son por **día** (sin selección de horario en UI; el día implica el slot según día de la semana).

---

## 1. Menú y navegación

- **Menú principal**: entrada **Reservas** (al hacer clic se muestra el panel de reservas del usuario). No existe ruta `/app/reservas/nueva`; todo el flujo (calendario, liberar cupos, nueva reserva) vive en `/app/reservas`.
- **Administración**: el ítem **Registro Piscina** debe estar bajo el título **Administración**.
- **Visibilidad**: **Registro Piscina** visible para roles **Tesorero** y **Administrador**. Tanto tesoreros como administradores ven panel de usuario (Reservas) y panel admin (Registro Piscina). Tanto **Tesorero** como **Administrador** pueden **aperturar** el mes siguiente (y realizar las demás acciones de Registro Piscina según se definan).

---

## 2. Panel de usuario – Reservas

### 2.1 Vista principal (calendario mensual)

- Mostrar un **calendario mensual** con las reservas del usuario.
- Navegación: poder cambiar al **mes siguiente** y a **meses anteriores**.
- **Celdas del calendario**:
  - **Verde**: día con reserva confirmada/activa.
  - **Blanco**: día sin reserva.
  - **Rojo**: reserva cancelada.
- **Leyenda**: debajo del calendario, explicar los tres estados (verde, blanco, rojo).

### 2.2 Botones sobre el calendario

- **Liberar cupos**
- **Nueva reserva**

### 2.3 Liberar cupos (sin reembolso)

- **Efecto**: libera el cupo para que otro usuario pueda agendar; **no** genera reembolso.
- **Flujo**:
  1. Al presionar "Liberar cupos" se habilitan **checkboxes** en las celdas que tienen reserva.
  2. Solo se pueden seleccionar **sesiones con fecha posterior a hoy**.
  3. Bajo el calendario, botón **"Confirmar liberaciones"**.
  4. Al presionarlo: abrir **modal** con resumen de fechas a liberar y pedir confirmación.
  5. Tras confirmar en el modal → llamada a la API para dar de baja las sesiones seleccionadas.

### 2.4 Nueva reserva

- **Habilitación**: el botón **Nueva reserva** solo se habilita cuando la **API lo autorice** (cuando el administrador haya cargado las fechas disponibles para el mes siguiente).
- **Contenido**:
  - Recuadro con el **total a transferir**:
    - **No socios**: 3.000 por sesión.
    - **Socios**: 2.000 por sesión.
  - Junto al monto, botón **"Confirmar reserva"**.
- **Cálculo del monto**:
  - `(Cantidad de sesiones agendadas × valor por sesión) − reembolsos por cancelación del administrador`
  - Los reembolsos por cancelación del admin deben estar en un **registro de reembolsos por cancelación** y descontarse de lo que el usuario debe pagar.
- **Flujo**:
  1. Al hacer clic en "Confirmar reserva" → **modal** con el detalle de la reserva y monto.
  2. Al confirmar en el modal → enviar **correo al usuario** con el detalle de lo que debe pagar.

**Respaldo por correo**: Todas las acciones relevantes del usuario deben quedar respaldadas con un correo al usuario (nueva reserva con total a pagar, liberación de cupo confirmada, etc.).

### 2.5 Mensaje inferior

- Debajo de todo el panel: mensaje de texto invitando a que las **solicitudes especiales** se envíen al **correo o WhatsApp del club**.

---

## 3. Panel administrador – Registro Piscina

- Ubicación: bajo **Administración**, ítem **Registro Piscina**.
- Al hacer clic: se muestra un **calendario del mes actual** (y posibilidad de ver meses anteriores).

### 3.1 Calendario admin – cupos

- Formato por día: **x/y** (cupos tomados / cupos disponibles o total).
- Se pueden ver **mes actual y meses anteriores**.
- **Meses pasados**: solo lectura (no editables).
- **Mes actual** (o mes con días aún editables): se debe poder **aumentar cupos** por día cuando corresponda.

### 3.2 Apertura del mes siguiente

- **Aperturar el siguiente mes**: definir **qué días** estarán disponibles para reserva (algunos lunes, miércoles o viernes pueden ser feriados o no disponibles). Pueden aperturar tanto **Administrador** como **Tesorero**.
- **UI**: checkboxes en el calendario para marcar días disponibles.
- **Confirmación**: botón que abre un **modal con resumen** de la apertura; al confirmar se envía la información a la API.

### 3.3 Cancelación de días por admin

- Opción para **cancelar días** que en un principio estaban abiertos (cancelaciones no previstas).
- Al ejecutar la cancelación:
  - Llamada a la **API**.
  - La información debe cargarse en el **registro de reembolsos** de los usuarios afectados (para descontar del monto a pagar en futuras reservas o para gestionar reembolsos).

---

## 4. Resumen de datos y reglas de negocio

| Concepto | Detalle |
|----------|---------|
| Horarios fijos | Lunes 21:00, Miércoles 8:00, Viernes 19:00 (sin selección de horario en UI) |
| Precio no socio | 3.000 por sesión |
| Precio socio | 2.000 por sesión |
| Nueva reserva usuario | Solo si admin cargó fechas del mes siguiente |
| Liberar cupos | Usuario libera sesiones futuras; sin reembolso |
| Cancelación admin | Registra reembolsos; el monto a pagar del usuario = sesiones × precio − reembolsos por cancelación admin |
| Reembolsos | Registro explícito de reembolsos por cancelación (admin) para descontar del total a pagar |
| Socio | Campo **socio** en User o Profile; determina precio (2.000 vs 3.000). Editable **solo por el administrador** en una vista del panel de administración. Menú simple: por ahora solo este dato editable; en el futuro se podrán agregar más campos. |

---

## 5. Respaldo por correo al usuario

Las acciones del usuario que modifican datos deben generar un correo de respaldo al usuario:

- **Nueva reserva confirmada**: detalle de sesiones y total a pagar (ya indicado arriba).
- **Liberación de cupos confirmada**: resumen de las fechas/sesiones liberadas (sin reembolso).
- Cualquier otra acción relevante que se incorpore (p. ej. cancelación por admin con reembolso) debe notificarse por correo al usuario afectado.

---

## 6. Endpoint único de contexto (recomendado)

Para que la página de reservas haga **una sola petición** al cargar o al cambiar de mes, se recomienda un endpoint que devuelva todo lo necesario:

**`GET /api/reservations/context?monthYear=YYYY-MM`**

**Datos que traería:**

| Dato | Descripción |
|------|-------------|
| **calendar** | Días del mes con estado para el usuario: `date`, `status` (RESERVED / CANCELLED / null), `reservationId` cuando aplica (para liberar cupos). Solo días Lun/Mié/Vie. |
| **canReserveNextMonth** | boolean: si el mes siguiente está abierto por admin/tesorero y el usuario puede hacer Nueva reserva. |
| **nextMonthAvailableDates** | Si `canReserveNextMonth`, array de fechas (ISO) disponibles para reservar en el mes siguiente. |
| **pricing** | `{ isSocio: boolean, pricePerSession: number }` (2000 o 3000). Para el recuadro total a transferir. |
| **pendingRefunds** | Monto total de reembolsos pendientes por cancelación admin para este usuario. |
| **schedules** | Resumen de los 3 horarios (Lun 21:00, Mié 8:00, Vie 19:00) para etiquetas en UI. |

Con esto el frontend pinta el calendario, habilita/deshabilita "Nueva reserva", muestra precios y puede calcular el total a pagar sin llamadas adicionales.

---

## 7. Relación con otros documentos

- **Plan de tareas API y frontend**: ver `reservas-plan-tareas.md`.
- **Ideas de desarrollo futuro** (períodos, acompañantes, batch, etc.): ver sección final de `reserve-guidelines.md`. La **fuente de verdad** del sistema actual es este documento y `reservas-plan-tareas.md`.
