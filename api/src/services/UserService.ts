import { User, Role } from '@prisma/client';
import { IUserService, IUserRepository, ServiceResult, ServiceResultHelper } from '@/types';
import { supabaseAdmin } from '@/config/supabase';

/**
 * Factory function para crear service de usuarios
 * Contiene lógica de negocio extraída de userController
 */
export const createUserService = (userRepo: IUserRepository): IUserService => ({

  async getAllUsers(): Promise<ServiceResult<User[]>> {
    try {
      const users = await userRepo.findAll();
      return ServiceResultHelper.success(users);
    } catch (error) {
      return ServiceResultHelper.error('USER_FETCH_ERROR');
    }
  },

  async getUserById(id: number): Promise<ServiceResult<User>> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        return ServiceResultHelper.error('USER_INVALID_ID');
      }

      const user = await userRepo.findById(id);
      
      if (!user) {
        return ServiceResultHelper.error('USER_NOT_FOUND');
      }

      return ServiceResultHelper.success(user);
    } catch (error) {
      return ServiceResultHelper.error('USER_FETCH_ERROR');
    }
  },

  async createUser(data: {
    email: string;
    name: string;
    password: string;
    phone?: string;
    role?: string;
  }): Promise<ServiceResult<User>> {
    try {
      const { email, name, password, phone, role } = data;

      // Validar campos requeridos
      if (!email || !name || !password) {
        return ServiceResultHelper.error('USER_MISSING_REQUIRED_FIELDS');
      }

      // Verificar si el email ya existe
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser) {
        return ServiceResultHelper.error('USER_EMAIL_ALREADY_EXISTS');
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
        return ServiceResultHelper.error('USER_CREATE_ERROR');
      }
      
      // Crear registro en nuestra base de datos
      const newUser = await userRepo.create({
        auth_id: authUser.user.id,
        email,
        name,
        phone: phone || undefined,
        role: (role as Role) || Role.USER,
        isActive: true,
        provider: 'email',
        profileCompleted: !!(name && phone),
      });
      
      return ServiceResultHelper.success(newUser);
    } catch (error) {
      return ServiceResultHelper.error('USER_CREATE_ERROR');
    }
  },

  async getUserProfile(authId: string): Promise<ServiceResult<User>> {
    try {
      const user = await userRepo.findByAuthId(authId);
      
      if (!user) {
        return ServiceResultHelper.error('USER_NOT_FOUND');
      }
      
      return ServiceResultHelper.success(user);
    } catch (error) {
      return ServiceResultHelper.error('USER_FETCH_ERROR');
    }
  },

});

