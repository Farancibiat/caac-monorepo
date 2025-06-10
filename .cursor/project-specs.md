# Especificaciones del Proyecto - Club de Aguas Abiertas Chiloé

## Información General
- **Dominio**: www.aguasabiertaschiloe.cl
- **Objetivo**: Sitio web oficial del Club de Aguas Abiertas Chiloé
- **Estructura**: Monorepo con API (existente) y Frontend (a desarrollar)

## Funcionalidades del Sitio

### Sitio Público
1. **Home de Bienvenida**
   - Hero section con llamada a registrarse para reservar horas de piscina
   - Invitación al 3° Desafío Unión de las Islas 2026
   - llamada a la acción para ir a la galería 
   - Próximos eventos destacados

2. **Calendario Público de Eventos**
   - Vista mensual/anual de eventos de natación
   - Filtros por tipo de evento
   - Detalles de cada evento

3. **Galería de Eventos** ⚠️ *FASE FINAL*
   - **Temporal**: Página con mensaje "En desarrollo" y mocks
   - **Final**: Integración con Google Drive para almacenamiento
   - Organización por eventos/fechas
   - Visualización responsive

4. **Sobre Nosotros**
   - Historia del club
   - Misión y visión
   - Equipo directivo

5. **Contacto**
   - Formulario de contacto
   - Información de ubicación
   - Redes sociales

6. **Registro/Login**
   - Autenticación con Google OAuth
   - Registro de nuevos usuarios
   - Recuperación de contraseña

### Sitio Privado (Usuarios Autenticados) 🎯 *PRIORIDAD ALTA*

#### Panel de Usuario
1. **Gestión de Membresía**
   - Solicitar ser socio (si no lo es)
   - Estado de la solicitud
   - Información de membresía

2. **Reservas de Piscina** 🚀 *CRÍTICO*
   - Ver horarios disponibles
   - Realizar reservas
   - Historial de reservas
   - Estado de pagos
   - Cancelación de reservas
   - Notificaciones de confirmación

#### Panel de Administrador/Tesorero 🎯 *PRIORIDAD ALTA*
1. **Gestión de Socios**
   - Autorizar solicitudes de membresía
   - Gestionar usuarios activos
   - Roles y permisos

2. **Gestión de Reservas** 🚀 *CRÍTICO*
   - Confirmar reservas de piscina
   - Gestionar pagos
   - Reportes de uso
   - Dashboard de ocupación
   - Gestión de horarios disponibles

## Modelo de Datos

### Entidades Principales
- **User**: Usuarios del sistema con roles (ADMIN, TREASURER, USER)
- **SwimmingSchedule**: Horarios de natación disponibles
- **Reservation**: Reservas de usuarios con estados
- **PaymentRecord**: Registros de pagos

### Roles de Usuario
- **USER**: Usuario básico, puede hacer reservas
- **TREASURER**: Puede confirmar pagos
- **ADMIN**: Acceso completo al sistema

## Fases de Desarrollo

### **Fase 1: Configuración y Autenticación** 🚀 *INMEDIATO*
- Configuración inicial del proyecto
- Sistema de autenticación completo
- Layout básico y navegación

### **Fase 2: Páginas Públicas Básicas** 📄 
- Página de inicio (Home)
- Sobre Nosotros
- Contacto
- Galería con **mensaje "En desarrollo"** y mocks
- Calendario básico (sin eventos reales inicialmente)

### **Fase 3: Sistema de Reservas - CORE** 🎯 
- **Panel de usuario para reservas**
- **Visualización de horarios disponibles**
- **Creación de reservas**
- **Historial de reservas del usuario**
- **Integración completa con API existente**
- **Manejo de estados de reserva**

### **Fase 4: Panel de Administración** 👨‍💼 
- **Dashboard administrativo**
- **Gestión de reservas (confirmar/cancelar)**
- **Gestión de usuarios y roles**
- **Reportes básicos de uso**
- **Gestión de horarios disponibles**

### **Fase 5: Funcionalidades Avanzadas** ⚡ 
- **Sistema de pagos y confirmaciones**
- **Notificaciones por email**
- **Calendario público con eventos reales**
- **Optimizaciones de performance**


### **Fase 6: Galería y Optimizaciones Finales** 🖼️ *FASE FINAL*
- **Integración con Google Drive**
- **Galería completa de eventos**
- **Optimizaciones SEO avanzadas**
- **Testing completo**
- **Testing E2E completo**
- **Deployment a producción**

## Consideraciones de Negocio

### Reservas
- Verificar disponibilidad antes de confirmar
- Prevenir doble reserva del mismo horario
- Validar capacidad máxima por horario
- Control de reservas por usuario (límites)

### Estados de Reserva
- PENDING → CONFIRMED → COMPLETED
- Rollback automático en caso de errores
- Sincronización entre frontend y backend

## Notas Importantes
- **Prioridad absoluta**: Sistema de reservas funcional y seguro
- **Galería temporal**: Mocks hasta fase final
- Mantener compatibilidad con API existente
- Implementar manejo de errores robusto
- Configurar variables de entorno para diferentes ambientes
- Documentar APIs y componentes críticos
- **Testing exhaustivo** del sistema de reservas

## Anexo - Propuestas Futuras

### Sistema de Logging Avanzado

#### Implementación de Logging
- Implementación con Winston
- Rotación diaria de logs
- Formato JSON
- Inclusión de metadata
- Salida con códigos de color en terminal

#### Gestión de Logs
- Retención de 30 días
- Configuración por nivel
- Compresión automática
- Sistema de backup
- Funcionalidad de búsqueda

#### Monitoreo
- Seguimiento de tasas de error
- Monitoreo de tiempos de respuesta
- Seguimiento de uso de recursos
- Sistema de alertas
- Logging para debugging 