import { PrismaClient } from '@prisma/client';

// Validar que la URL de la base de datos esté configurada
const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Validar formato básico de la URL de PostgreSQL
const isValidPostgresUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'postgresql:' || parsedUrl.protocol === 'postgres:';
  } catch {
    return false;
  }
};

if (!isValidPostgresUrl(databaseUrl)) {
  throw new Error(`Invalid DATABASE_URL format. Expected postgresql:// or postgres:// but got: ${databaseUrl.substring(0, 20)}...`);
}

// Configurar Prisma con manejo de errores mejorado
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: databaseUrl,
      ...(directUrl && { directUrl })
    }
  }
});

// Función para verificar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Función para desconectar limpiamente
export const disconnect = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

export default prisma; 