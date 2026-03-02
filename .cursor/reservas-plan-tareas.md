# Plan de tareas: Sistema de Reservas (API + Frontend)

Referencia funcional: [reservas-especificacion.md](reservas-especificacion.md).

Este documento solo planifica tareas; **no modifica** archivos de implementación hasta que el plan sea corroborado.

---

## Inconsistencias detectadas (estado actual vs especificación)

### API

- **Horarios**: El modelo actual usa `SwimmingSchedule` por horario con `dayOfWeek` y `startTime`/`endTime`. La especificación fija 3 slots (Lun 21:00, Mié 8:00, Vie 19:00). Hay que alinear: o bien 3 registros fijos en BD o un único modelo de “día disponible” por fecha.
- **Disponibilidad por mes**: No existe concepto de “mes abierto” ni “días disponibles del mes siguiente”. Falta modelo/API para que el admin marque qué días están abiertos a reserva por mes.
- **Reembolsos**: No existe modelo ni endpoints para “reembolsos por cancelación del administrador”. El cálculo “sesiones × precio − reembolsos” y el email con monto a pagar lo requieren.
- **Precios**: No hay precios por tipo de usuario (socio / no socio) en el modelo actual. Los valores 2.000 / 3.000 deben estar en configuración o en modelo.
- **Autorización “Nueva reserva”**: No hay endpoint que indique si el usuario puede reservar (p. ej. “mes siguiente ya cargado por admin”).

### Frontend

- **Menú Reservas**: El sidebar tiene “Mis Reservas” y “Nueva Reserva” como submenús. La especificación pide un único ítem “Reservas” que al hacer clic muestre el calendario (y desde ahí botones Liberar cupos / Nueva reserva). Ajustar estructura del menú.
- **Página principal reservas**: No existe `app/reservas/page.tsx`; solo `app/reservas/nueva/page.tsx`. Falta la página con calendario mensual.
- **Registro Piscina**: No existe ítem “Registro Piscina” bajo Administración; el sidebar tiene Panel General, Usuarios, Eventos, Finanzas. Añadir ítem y ruta.
- **Nueva reserva (UI actual)**: La página actual pide fecha, horario y ubicación; la especificación es solo por día, sin elegir horario ni ubicación, con monto (socio/no socio) y confirmación por modal + email.

---

## Tareas API

### Modelos y datos

| # | Tarea | Notas |
|---|--------|-------|
| 1 | Definir o ajustar modelo de **días disponibles por mes** (admin marca qué días están abiertos). | Puede ser tabla `month_availability` o `schedule_day_availability` con `monthYear` + `date` o `dayOfWeek` + `scheduleId`. Evitar duplicar lógica de `reserve-guidelines.md` si se simplifica (solo 3 horarios fijos). |
| 2 | Añadir modelo **Reembolso por cancelación** (admin cancela día → registros de reembolso por usuario/sesión). | Campos sugeridos: userId, reservationId o referencia a sesión cancelada, monto, motivo, fecha, estado (pendiente/aplicado). |
| 3 | Añadir campo **socio** en `User` o `Profile` para precios (2.000 vs 3.000). | Editable **solo por el administrador** en una vista del panel de administración; menú simple, solo este dato por ahora (se podrán agregar más campos después). |
| 4 | Fijar precios 2.000 (socio) y 3.000 (no socio) en configuración o tabla de parámetros. | Evitar hardcodear en muchos sitios; un solo lugar (config o BD). |
| 4b | **PATCH** usuario (campo socio): solo ADMIN puede editar `socio` de un usuario. Ej. `PATCH /api/user/:id` con body `{ socio: boolean }`. | Para la vista de administración que edita solo este dato por ahora. |

### Endpoints – usuario

| # | Tarea | Notas |
|---|--------|-------|
| 5 | **GET** calendario mensual del usuario por `monthYear`: lista de fechas con estado (reservado / cancelado / sin reserva). | Respuesta por día: fecha, status (CONFIRMED/PENDING, CANCELLED, ninguno). Incluir solo días que correspondan a Lun/Mié/Vie. |
| 6 | **GET** “¿Puede el usuario hacer nueva reserva?” (mes siguiente abierto por admin/tesorero). | Puede ir en un endpoint dedicado o dentro del **endpoint de contexto** (ver sección “Endpoint único de contexto” más abajo). |
| 7 | **POST** liberar cupos (lista de reservationIds o fechas). | Solo reservas del usuario, solo fechas futuras. Actualizar estado a CANCELLED; no crear reembolso. Validar que no esté ya cancelada/completada. |
| 8 | **POST** nueva reserva (mes siguiente): recibir fechas/días a reservar. | Validar: mes siguiente abierto, días en la lista de disponibles, cupos, usuario no tenga ya reserva ese día. Calcular monto: (sesiones × precio según socio) − reembolsos pendientes del usuario. Crear reservas (PENDING), devolver monto final e instrucciones; disparar envío de email con detalle a pagar. |

### Endpoints – administración (Registro Piscina)

| # | Tarea | Notas |
|---|--------|-------|
| 9 | **GET** calendario admin por mes: por día, cupos tomados vs disponibles (formato x/y). | Incluir meses anteriores (solo lectura) y mes actual. Respuesta: por fecha (y por schedule si se mantiene por horario): reserved count, capacity o available. |
| 10 | **PUT/PATCH** aumentar cupos por día (mes actual). | Solo para mes actual o mes “editable”. Definir si el cupo es por día global o por schedule. |
| 11 | **POST** aperturar mes siguiente: enviar lista de días disponibles (checkboxes). | Permiso: **ADMIN** y **TREASURER**. Persistir en el modelo de “días disponibles por mes”. No permitir reservas de usuarios hasta que esto exista para ese mes. |
| 12 | **POST** cancelar día(s) que estaban abiertos. | Marcar día(s) como no disponibles; para cada reserva existente en esas fechas: cancelar reserva y crear registro de reembolso por cancelación (para descontar del monto a pagar del usuario). |

### Emails y negocio

| # | Tarea | Notas |
|---|--------|-------|
| 13 | **Emails de respaldo al usuario**: (1) Tras confirmar **nueva reserva**: detalle de sesiones y monto a pagar. (2) Tras **liberar cupos**: correo confirmando las fechas/sesiones liberadas (sin reembolso). Cualquier otra acción relevante del usuario debe notificarse por correo. | Reutilizar o extender servicio de email existente; incluir desglose y reembolsos descontados cuando aplique. |
| 14 | Ajustar **cancelación de reserva** (usuario): mantener `PUT /:id/cancel` o unificar con “liberar cupos” en batch; asegurar que “liberar” no cree reembolso. Tras liberar, enviar email de confirmación al usuario. | Diferenciar en backend: cancelación por usuario (liberar) vs cancelación por admin (reembolso). |

---

## Tareas Frontend

### Navegación y estructura

| # | Tarea | Notas |
|---|--------|-------|
| 15 | Ajustar **menú Reservas**: un ítem “Reservas” que lleve a `/app/reservas` (calendario). Sin submenús “Mis Reservas” ni “Nueva reserva”. | Pantalla única con botones Liberar cupos y Nueva reserva sobre el calendario. |
| 16 | **Quitar** la ruta y página `/app/reservas/nueva` (eliminar `app/reservas/nueva/page.tsx` y referencias en menú/rutas). | Todo el flujo de reservas en `/app/reservas`. |
| 17 | Añadir bajo **Administración** el ítem **Registro Piscina** con ruta `/app/admin/registro-piscina` (o similar). | Visible para ADMIN y TREASURER. |
| 18 | Crear **página** `app/reservas/page.tsx`: calendario mensual + botones + leyenda + mensaje de contacto. | Ruta principal de reservas del usuario. |

### Panel de usuario – Reservas

| # | Tarea | Notas |
|---|--------|-------|
| 19 | Implementar **calendario mensual** con navegación anterior/siguiente y colores por estado (verde/blanco/rojo). | Consumir endpoint de calendario (tarea 5) o de contexto (reservas-especificacion.md §6). Celdas solo para días Lun/Mié/Vie o todas según diseño. |
| 19 | Leyenda debajo del calendario: verde = reservado, blanco = sin reserva, rojo = cancelado. | Texto claro y accesible. |
| 20 | Botón **Liberar cupos**: al activarse, mostrar checkboxes en celdas con reserva (solo fechas futuras). Botón “Confirmar liberaciones” bajo el calendario. | Deshabilitar fechas pasadas/hoy. |
| 21 | Modal **Confirmar liberaciones**: resumen de fechas a liberar y botón de confirmación que llame al endpoint de liberación (tarea 7). | Tras éxito, backend envía email de confirmación al usuario; mostrar mensaje y actualizar calendario. |
| 22 | Botón **Nueva reserva**: habilitado/deshabilitado según respuesta del API (tarea 6). Si se habilita, flujo según especificación. | Deshabilitado hasta que admin o tesorero abra el mes siguiente. |
| 23 | Flujo **Nueva reserva**: recuadro con total a transferir (sesiones × 2.000 o 3.000 − reembolsos) y botón “Confirmar reserva”. | El monto puede venir del backend al “preparar” la reserva o calcularse en front con datos del API. |
| 24 | Modal **Confirmar reserva**: detalle de la reserva y monto; al confirmar, llamar API (tarea 8) y mostrar resultado; el backend envía el email. | Evitar doble envío de email; responsabilidad en API. |
| 25 | Mensaje inferior: solicitudes especiales al correo o WhatsApp del club. | Texto e hipervínculo si se tienen datos de contacto. |

### Panel admin – Registro Piscina y edición de socio

| # | Tarea | Notas |
|---|--------|-------|
| 27 | Página **Registro Piscina**: calendario del mes actual (y navegación a meses anteriores). | Cupos en formato x/y por día (tarea 9). |
| 28 | Meses anteriores en solo lectura; mes actual (o mes editable) con posibilidad de **aumentar cupos** por día. | UI según diseño (input, +/-, etc.). |
| 29 | Flujo **Aperturar mes siguiente**: checkboxes por día (Lun/Mié/Vie); botón que abre modal con resumen y confirma; llamar endpoint (tarea 11). | Permiso ADMIN y TREASURER. Solo días que correspondan a los 3 horarios. |
| 30 | Flujo **Cancelar día(s)** ya abiertos: selección de días y confirmación; llamar endpoint (tarea 12) que actualice reembolsos. | Modal de confirmación y mensaje de resultado. |
| 30b | Vista en panel de administración para **editar campo socio** del usuario. | Menú simple; por ahora solo este dato editable (solo ADMIN). En el futuro se podrán agregar más campos a editar. Ruta sugerida: `/app/admin/usuarios` o sección dentro de gestión de usuarios. |

### Integración y UX

| # | Tarea | Notas |
|---|--------|-------|
| 31 | Tipos TypeScript en frontend alineados con respuestas de la API (calendario, contexto, reembolsos, cupos x/y). | Evitar `any`; reutilizar o definir en `types/`. |
| 32 | Manejo de errores y estados de carga en calendarios y modales. | Toasts o mensajes claros; deshabilitar botones mientras se envía. |

---

## Sugerencias de mejora (sin implementar aún)

1. **Un solo “contexto” de reservas**: Un endpoint que devuelva para un mes: calendario del usuario + `canReserveNextMonth` + fechas disponibles del mes siguiente (si aplica), para reducir llamadas desde el frontend.
2. **Idempotencia**: En “confirmar reserva” y “confirmar liberaciones”, usar idempotency key o validación en backend para evitar doble clic.
3. **Auditoría**: Registrar en log o tabla quién (admin) aperturó un mes o canceló un día, y cuándo.
4. **Límite de sesiones por usuario por mes**: Definir si hay tope (ej. máximo N sesiones por mes) y validarlo en API y mostrar en UI.
5. **Reserva en dos pasos**: “Reservar” crea reservas PENDING y envía email; “Confirmar pago” lo hace tesorero/admin. Dejar claro en UI que el usuario debe transferir y el club confirmar.
6. **Registro Piscina – permisos**: TREASURER y ADMIN pueden aperturar, editar cupos y cancelar días (ya definido en especificación).

---

## Orden sugerido de implementación

1. **API**: Modelos (días disponibles, reembolsos, socio/no socio, precios) y migraciones.
2. **API**: Endpoints de lectura (calendario usuario, can-reserve, calendario admin).
3. **Frontend**: Estructura de menú y página principal de reservas con calendario y leyenda.
4. **API**: Liberar cupos y nueva reserva (con cálculo de monto y reembolsos).
5. **Frontend**: Flujos Liberar cupos y Nueva reserva (modales y llamadas API).
6. **API**: Apertura de mes y cancelación de días por admin (con reembolsos).
7. **Frontend**: Página Registro Piscina y flujos admin.
8. **Email**: Template y envío tras confirmar reserva.
9. **Pulido**: Mensaje de contacto, manejo de errores, tipos y pruebas.

---

## Referencias

- Especificación: [reservas-especificacion.md](reservas-especificacion.md)
- Lineamientos técnicos e ideas futuras: [reserve-guidelines.md](reserve-guidelines.md) (fuente de verdad del plan actual: este documento y reservas-especificacion.md).
- Progreso del proyecto: [progreso-proyecto.md](progreso-proyecto.md)
- Especificaciones generales: [project-specs.md](project-specs.md)
