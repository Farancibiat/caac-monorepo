# Evaluación: actualización de dependencias (frontend)

Evaluación de coste, impacto en código y pros/contras de actualizar las dependencias del frontend.

---

## 1. Estado actual (resumen)

| Categoría | Paquetes | Observación |
|-----------|----------|-------------|
| **Core** | next 14.2.29, react ^18, react-dom ^18 | Estable, LTS |
| **Inconsistencia** | @next/third-parties ^15.3.3 | Mayor que Next (14); puede dar warnings o comportamientos raros |
| **Validación** | yup ^1.6.1, zod ^3.25.48 | Dos librerías de validación (duplicación) |
| **UI** | Radix, shadcn-style (cva, tailwind-merge, etc.) | Varias deps menores actualizables sin breaking |
| **Auth/Data** | @supabase/ssr, @supabase/supabase-js, zustand | Actualizaciones normalmente compatibles |

No usas `useFormStatus` ni `useFormState`, así que un futuro salto a React 19 no te afecta por ahí.

---

## 2. Escenarios de actualización

### Escenario A: Solo parches y minors (sin cambiar Next/React major)

**Qué hacer:** Actualizar todo lo que respete semver dentro de los rangos actuales (`npm update` o fijar versiones concretas dentro de ^ actual).

**Código a tocar:** Ninguno o casi ninguno.  
**Riesgo:** Bajo.  
**Tiempo:** Poco (instalar, build, smoke test).

**Pros:** Seguridad y bugs sin cambiar APIs.  
**Contras:** No obtienes mejoras de Next 15 / React 19.

---

### Escenario B: Next 15 + React 19 (major)

**Qué implica:**

- **Next 14 → 15**
  - `cookies()` y `headers()` pasan a ser async: en tu código **ya usas `await cookies()` y `await headers()`** en `stores/auth/server.ts` y `stores/auth/actions.ts`, así que esta parte está lista.
  - `params` y `searchParams` en páginas/layouts pasan a ser `Promise<>`: en el repo **no hay páginas que reciban `params` o `searchParams`** como props; solo usas `request.nextUrl.searchParams` en middleware y `request.url` en el route handler, que no cambian con este breaking.
  - **fetch:** por defecto ya no se cachea. Tus `fetch` en `lib/api-server.ts` y `lib/api-client.ts` son llamadas a tu API con opciones explícitas; no dependes del cache por defecto de Next, así que el cambio no te obliga a tocar código (solo si quisieras cache explícito en algún otro sitio).
  - **Client-side router cache:** en 15 ya no se reutilizan segmentos de página desde el cache del router como antes; puedes configurar `staleTimes` si necesitas comportamiento específico.
  - **Codemod oficial:** `npx @next/codemod@canary upgrade latest` para automatizar parte del cambio.

- **React 18 → 19**
  - Tipos: `@types/react` y `@types/react-dom` a versiones que soporten React 19.
  - No usas `useFormStatus` ni `useFormState`, así que no hay que migrar a `useActionState`.

**Código a tocar (estimado):**

- Ajustar **alineación de versiones**: hoy tienes `next` 14 y `@next/third-parties` 15; conviene dejar todo en 15 (o todo en 14). Con el upgrade a Next 15 se resuelve.
- Revisar **next.config**: si usas algo `experimental.*` que en 15 pasó a estable (p. ej. `serverComponentsExternalPackages` → `serverExternalPackages`). Tu `next.config.mjs` actual no usa esos flags.
- **Pruebas manuales / E2E:** navegación, auth, formularios, reservas, middleware (redirects, OAuth).

**Riesgo:** Medio (cambios de comportamiento de cache y router; posibles ajustes en tipos o en una librería que no sea compatible con React 19 aún).

**Tiempo estimado:** 1–3 días (upgrade, revisar warnings, corregir tipos, probar flujos críticos).

**Pros:**

- Next 15: mejor modelo de render, APIs async coherentes, codemods.
- React 19: mejoras de rendimiento y futura compatibilidad.
- Alineas `next` y `@next/third-parties` (evitas mezcla 14/15).

**Contras:**

- Algunas deps (p. ej. Radix, react-day-picker) pueden no declarar soporte React 19 aún; suele funcionar igual, pero hay que probar.
- Comportamiento del router y del cache distinto; hay que validar en tu app.

---

### Escenario C: Actualizar también react-day-picker (v8 → v9)

**Qué implica:** En v9 cambian nombres de clases CSS (`day_disabled` → `disabled`, `cell` → `day`, etc.), props (`fromDate`/`toDate` → `startMonth`/`endMonth`/`hidden`), y la API de componentes (p. ej. iconos). Tu `components/ui/calendar.tsx` usa `DayPicker` con `classNames` y `components: { IconLeft, IconRight }`, al estilo shadcn.

**Código a tocar:** Básicamente solo `components/ui/calendar.tsx` (y cualquier otro uso directo de react-day-picker), más estilos si usas clases propias.

**Riesgo:** Bajo–medio si lo haces en un cambio dedicado; la guía de migración de react-day-picker y la de shadcn para v9 son claras.

**Recomendación:** No mezclar con el salto a Next 15 + React 19. Hacerlo después de estabilizar ese salto, o en un PR aparte.

---

## 3. Duplicación: Yup + Zod

Tienes **yup** y **zod** a la vez. En el frontend suele usarse uno para esquemas de formularios (p. ej. con `@hookform/resolvers`).

- **Costo de unificar en Zod:** Revisar todos los formularios que usan Yup, reescribir esquemas a Zod y cambiar el resolver a `zodResolver`. Tiempo acotado pero no trivial (depende de cuántos formularios).
- **Beneficio:** Menos dependencias, un solo modelo mental, y alineación con la API (que ya usa Zod).
- **Recomendación:** Tratarlo como refactor aparte (no obligatorio para “actualizar deps”), pero conveniente a medio plazo.

---

## 4. Resumen de recomendación

| Objetivo | Acción sugerida | Código a modificar | Riesgo |
|----------|-----------------|--------------------|--------|
| Mantenimiento mínimo | Escenario A: `npm update`, revisar changelogs de minors | Poco o ninguno | Bajo |
| Aprovechar Next 15 + React 19 | Escenario B: upgrade con codemod + pruebas | Config + tipos + pruebas | Medio |
| Mejorar calendario y consistencia | Escenario C (react-day-picker v9) en otro momento | Solo `calendar.tsx` (+ estilos) | Bajo–medio |
| Reducir deuda | Unificar validación en Zod (opcional) | Formularios que usan Yup | Bajo |

**Conclusión:**

- **Si buscas bajo costo y poco cambio de código:** quédate en Escenario A (actualizar solo parches/minors dentro de las majors actuales). Ganas correcciones y parches de seguridad con casi cero impacto.
- **Si quieres estar en Next 15 + React 19:** el costo es moderado (1–3 días) y tu código ya está bien preparado (cookies/headers async, sin params/searchParams en páginas, sin useFormState/useFormStatus). El mayor esfuerzo es validar comportamiento (navegación, auth, formularios) y alinear `@next/third-parties` con Next 15.

Si indicas si prefieres “solo parches” o “Next 15 + React 19”, se puede bajar esto a una lista concreta de comandos y pasos (orden de ejecución y qué revisar en cada paso).
