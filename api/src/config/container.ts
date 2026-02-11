import { PrismaClient } from '@prisma/client';
import { 
  createReservationRepository, 
  createScheduleRepository,
  createAuthRepository,
  createUserRepository,
  createEmailRepository,
  createEventRepository,
  createProfileRepository
} from '@/repositories';
import { 
  createReservationService, 
  createScheduleService, 
  createBusinessRulesService,
  createAuthService,
  createUserService,
  createEmailService,
  createEventService,
  createProfileService
} from '@/services';
import { 
  IReservationRepository, 
  IScheduleRepository,
  IReservationService, 
  IScheduleService,
  IBusinessRulesService,
  IAuthRepository,
  IAuthService,
  IUserRepository,
  IUserService,
  IEmailRepository,
  IEmailService,
  IEventRepository,
  IEventService,
  IProfileRepository,
  IProfileService
} from '@/types';

/**
 * Tipo para el contenedor de dependencias
 */
export type ServiceContainer = {
  // Repositories
  reservationRepository: IReservationRepository;
  scheduleRepository: IScheduleRepository;
  authRepository: IAuthRepository;
  userRepository: IUserRepository;
  emailRepository: IEmailRepository;
  eventRepository: IEventRepository;
  profileRepository: IProfileRepository;
  
  // Services
  reservationService: IReservationService;
  scheduleService: IScheduleService;
  businessRulesService: IBusinessRulesService;
  authService: IAuthService;
  userService: IUserService;
  emailService: IEmailService;
  eventService: IEventService;
  profileService: IProfileService;
  
  // Prisma (para casos especiales)
  prisma: PrismaClient;
};

/**
 * Factory function para crear el contenedor de dependencias
 * Aquí se "arman" todas las dependencias de la aplicación
 */
export const createServiceContainer = (prisma: PrismaClient): ServiceContainer => {
  // 1. Crear repositories (acceso a datos)
  const reservationRepository = createReservationRepository(prisma);
  const scheduleRepository = createScheduleRepository(prisma);
  const authRepository = createAuthRepository(prisma);
  const userRepository = createUserRepository(prisma);
  const emailRepository = createEmailRepository(prisma);
  const eventRepository = createEventRepository(prisma);
  const profileRepository = createProfileRepository(prisma);
  
  // 2. Crear services (lógica de negocio)
  const businessRulesService = createBusinessRulesService();
  const reservationService = createReservationService(
    reservationRepository, 
    scheduleRepository, 
    prisma
  );
  const scheduleService = createScheduleService(
    scheduleRepository, 
    reservationRepository
  );
  const authService = createAuthService(authRepository);
  const userService = createUserService(userRepository);
  const emailService = createEmailService(emailRepository);
  const eventService = createEventService(eventRepository);
  const profileService = createProfileService(profileRepository);

  // 3. Retornar contenedor con todas las dependencias
  return {
    // Repositories
    reservationRepository,
    scheduleRepository,
    authRepository,
    userRepository,
    emailRepository,
    eventRepository,
    profileRepository,
    
    // Services
    reservationService,
    scheduleService,
    businessRulesService,
    authService,
    userService,
    emailService,
    eventService,
    profileService,
    
    // Prisma (para casos especiales como transacciones complejas)
    prisma
  };
};

/**
 * Instancia global del contenedor (singleton)
 * Se inicializa una vez en index.ts
 */
let serviceContainer: ServiceContainer | null = null;

/**
 * Inicializar el contenedor de servicios
 */
export const initializeServiceContainer = (prisma: PrismaClient): void => {
  if (serviceContainer) {
    console.warn('Service container already initialized');
    return;
  }
  
  serviceContainer = createServiceContainer(prisma);
  console.log('✅ Service container initialized');
};

/**
 * Obtener el contenedor de servicios
 * Usar en controladores para acceder a services
 */
export const getServiceContainer = (): ServiceContainer => {
  if (!serviceContainer) {
    throw new Error('Service container not initialized. Call initializeServiceContainer() first.');
  }
  
  return serviceContainer;
};

/**
 * Helpers para acceso directo a services más comunes
 */
export const getReservationService = (): IReservationService => {
  return getServiceContainer().reservationService;
};

export const getScheduleService = (): IScheduleService => {
  return getServiceContainer().scheduleService;
};

export const getBusinessRulesService = (): IBusinessRulesService => {
  return getServiceContainer().businessRulesService;
};

export const getAuthService = (): IAuthService => {
  return getServiceContainer().authService;
};

export const getUserService = (): IUserService => {
  return getServiceContainer().userService;
};

export const getEmailService = (): IEmailService => {
  return getServiceContainer().emailService;
};

export const getEventService = (): IEventService => {
  return getServiceContainer().eventService;
};

export const getProfileService = (): IProfileService => {
  return getServiceContainer().profileService;
};
