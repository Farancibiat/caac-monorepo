import { Request, Response } from 'express';
import prisma from '@/config/db';
import { Role } from '@prisma/client';
import { sendMessage } from '@/utils/responseHelper';
import { supabaseAdmin } from '@/config/supabase';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    sendMessage(res, 'USER_LIST_RETRIEVED', users);
  } catch (error) {
    console.error('Error fetching users:', error);
    sendMessage(res, 'USER_FETCH_ERROR');
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      sendMessage(res, 'USER_INVALID_ID');
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
        reservations: true,
      },
    });
    
    if (!user) {
      sendMessage(res, 'USER_NOT_FOUND');
      return;
    }
    
    sendMessage(res, 'USER_RETRIEVED', user);
  } catch (error) {
    console.error('Error fetching user:', error);
    sendMessage(res, 'USER_FETCH_ERROR');
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password, phone, role } = req.body;
    
    if (!email || !password || !name) {
      sendMessage(res, 'USER_MISSING_REQUIRED_FIELDS');
      return;
    }
    
    // Verificar si el email ya existe en nuestra base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      sendMessage(res, 'USER_EMAIL_ALREADY_EXISTS');
      return;
    }
    
    // Crear usuario en Supabase Auth primero
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: name,
      },
      email_confirm: true, // Auto-confirmar email para usuarios creados por admin
    });

    if (authError || !authUser.user) {
      console.error('Error al crear usuario en Supabase:', authError);
      sendMessage(res, 'USER_CREATE_ERROR');
      return;
    }
    
    // Crear registro en nuestra base de datos
    const newUser = await prisma.user.create({
      data: {
        auth_id: authUser.user.id,
        email,
        name,
        phone: phone || null,
        role: role || Role.USER,
        isActive: true,
        provider: 'email',
        profileCompleted: !!(name && phone),
      },
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar_url: true,
        provider: true,
        profileCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    sendMessage(res, 'USER_CREATED', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    sendMessage(res, 'USER_CREATE_ERROR');
  }
}; 