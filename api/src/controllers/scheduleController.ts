import { Request, Response } from 'express';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';
import { getScheduleService } from '@/config/container';

/**
 * CONTROLADOR REFACTORIZADO - Patrón CSR
 * 
 * Cambios principales:
 * - 196 líneas → ~70 líneas
 * - Sin lógica de negocio
 * - Solo HTTP handling
 * - Toda la lógica movida a ScheduleService
 */

// Obtener todos los horarios
export const getAllSchedules = async (_req: Request, res: Response): Promise<void> => {
  try {
    const scheduleService = getScheduleService();
    
    const result = await scheduleService.getAllSchedules();
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }

    sendMessage(res, 'SCHEDULE_LIST_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'SCHEDULE_FETCH_ERROR');
  }
};

// Obtener un horario por ID
export const getScheduleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const scheduleService = getScheduleService();
    
    const result = await scheduleService.getScheduleById(Number(id));
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'SCHEDULE_RETRIEVED', result.data);
  } catch (error) {
    sendMessage(res, 'SCHEDULE_FETCH_ERROR');
  }
};

// Crear un nuevo horario (solo admin)
export const createSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const scheduleService = getScheduleService();
    
    const result = await scheduleService.createSchedule(req.body);
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'SCHEDULE_CREATED', result.data);
  } catch (error) {
    sendMessage(res, 'SCHEDULE_CREATE_ERROR');
  }
};

// Actualizar un horario (solo admin)
export const updateSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const scheduleService = getScheduleService();
    
    const result = await scheduleService.updateSchedule(Number(id), req.body);
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'SCHEDULE_UPDATED', result.data);
  } catch (error) {
    sendMessage(res, 'SCHEDULE_UPDATE_ERROR');
  }
};

// Eliminar un horario (solo admin)
export const deleteSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const scheduleService = getScheduleService();
    
    const result = await scheduleService.deleteSchedule(Number(id));
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'SCHEDULE_DELETED');
  } catch (error) {
    sendMessage(res, 'SCHEDULE_DELETE_ERROR');
  }
};

// Verificar disponibilidad de un horario
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduleId, date } = req.query;
    const scheduleService = getScheduleService();
    
    const result = await scheduleService.checkAvailability({
      scheduleId: Number(scheduleId),
      date: date as string
    });
    
    if (!result.success) {
      sendMessage(res, result.errorCode!);
      return;
    }
    
    sendMessage(res, 'SCHEDULE_AVAILABILITY_CHECKED', result.data);
  } catch (error) {
    sendMessage(res, 'SCHEDULE_AVAILABILITY_ERROR');
  }
};