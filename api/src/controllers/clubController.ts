import { Request, Response } from 'express';
import prisma, { testConnection } from '@/config/db';
import { sendMessage } from '@/utils/responseHelper';
import { AuthenticatedRequest } from '@/config/auth';

// Función helper para manejar errores de base de datos
const handleDatabaseError = (error: any, res: Response) => {
 
  // Errores específicos de Prisma/PostgreSQL
  if (error.code === 'P1001') {
    sendMessage(res, 'DATABASE_CONNECTION_ERROR');
    return;
  }
  if (error.code === 'P1002') {
    sendMessage(res, 'DATABASE_TIMEOUT_ERROR');
    return;
  }
  
  if (error.code === 'P1003') {
    sendMessage(res, 'DATABASE_NOT_FOUND_ERROR');
    return;
  }
  
  if (error.code === 'P1008') {
    sendMessage(res, 'DATABASE_TIMEOUT_ERROR');
    return;
  }
  
  if (error.code === 'P1010') {
    sendMessage(res, 'DATABASE_ACCESS_DENIED_ERROR');
    return;
  }

  if (error.message?.includes('Authentication error')) {
    sendMessage(res, 'DATABASE_AUTH_ERROR');
    return;
  }

  // Error genérico de base de datos
  sendMessage(res, 'CLUB_FETCH_ERROR');
};

export const getAllClubs = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Verificar conexión antes de hacer la consulta
    const isConnected = await testConnection();
    if (!isConnected) {
      sendMessage(res, 'DATABASE_CONNECTION_ERROR');
      return;
    }

    const clubs = await prisma.club.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    
    sendMessage(res, 'CLUB_LIST_RETRIEVED', clubs);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getClubById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      sendMessage(res, 'CLUB_INVALID_ID');
      return;
    }
    
    const club = await prisma.club.findUnique({
      where: { id: Number(id) },
    });
    
    if (!club) {
      sendMessage(res, 'CLUB_NOT_FOUND');
      return;
    }
    
    sendMessage(res, 'CLUB_RETRIEVED', club);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const createClub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;
    
    if (!nombre || nombre.trim().length === 0) {
      sendMessage(res, 'CLUB_MISSING_REQUIRED_FIELDS');
      return;
    }
    const existingClub = await prisma.club.findUnique({
      where: { nombre: nombre.trim() },
    });
    
    if (existingClub) {
      sendMessage(res, 'CLUB_ALREADY_EXISTS');
      return;
    }
    const newClub = await prisma.club.create({
      data: {
        nombre: nombre.trim(),
        isActive: true,
      },
    });
    sendMessage(res, 'CLUB_CREATED', newClub);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const updateClub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, isActive } = req.body;
    
    if (!id || isNaN(Number(id))) {
      sendMessage(res, 'CLUB_INVALID_ID');
      return;
    }

    const updateData: any = {};
    
    if (nombre !== undefined) {
      if (nombre.trim().length === 0) {
        sendMessage(res, 'CLUB_MISSING_REQUIRED_FIELDS');
        return;
      }
      updateData.nombre = nombre.trim();
    }
    
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }
    
    if (Object.keys(updateData).length === 0) {
      sendMessage(res, 'CLUB_NO_FIELDS_TO_UPDATE');
      return;
    }
    
    const existingClub = await prisma.club.findUnique({
      where: { id: Number(id) },
    });
    
    if (!existingClub) {
      sendMessage(res, 'CLUB_NOT_FOUND');
      return;
    }
    if (updateData.nombre && updateData.nombre !== existingClub.nombre) {
      const duplicateClub = await prisma.club.findUnique({
        where: { nombre: updateData.nombre },
      });
      
      if (duplicateClub) {
        sendMessage(res, 'CLUB_ALREADY_EXISTS');
        return;
      }
    }
    const updatedClub = await prisma.club.update({
      where: { id: Number(id) },
      data: updateData,
    });
    sendMessage(res, 'CLUB_UPDATED', updatedClub);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

//Inactiva Club, no borra registro
export const deleteClub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      sendMessage(res, 'CLUB_INVALID_ID');
      return;
    }
    const existingClub = await prisma.club.findUnique({
      where: { id: Number(id) },
    });
    
    if (!existingClub) {
      sendMessage(res, 'CLUB_NOT_FOUND');
      return;
    }
    
    await prisma.club.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });
    
    sendMessage(res, 'CLUB_DELETED');
  } catch (error) {
    handleDatabaseError(error, res);
  }
}; 