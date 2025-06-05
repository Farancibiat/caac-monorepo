// api/src/config/supabase.ts - CREAR NUEVO ARCHIVO
import { createClient } from '@supabase/supabase-js'

// Debug: Verificar que el archivo se está ejecutando
console.log('🔄 Iniciando configuración de Supabase...')

// Validar variables de entorno requeridas
const requiredEnvVars = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

// Debug: Mostrar el estado de las variables
console.log('🔍 Variables de entorno:')
console.log('SUPABASE_URL:', !!requiredEnvVars.SUPABASE_URL ? '✅ Configurada' : '❌ Faltante')
console.log('SUPABASE_ANON_KEY:', !!requiredEnvVars.SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Faltante')
console.log('SUPABASE_SERVICE_ROLE_KEY:', !!requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ Faltante')

// Verificar que todas las variables estén definidas
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`)
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

console.log('✅ Todas las variables de entorno están configuradas')

// Cliente para operaciones del lado del servidor (con anon key)
// Se usa en middleware de autenticación y operaciones básicas
export const supabase = createClient(
  requiredEnvVars.SUPABASE_URL!,
  requiredEnvVars.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false, // No necesario en el servidor
      persistSession: false,   // No persistir sesiones en el servidor
      detectSessionInUrl: false, // No detectar sesiones en URL del servidor
    },
  }
)

// Cliente administrativo (con service role key)
// Se usa para operaciones que requieren bypass de RLS
export const supabaseAdmin = createClient(
  requiredEnvVars.SUPABASE_URL!,
  requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)

console.log('🔧 Clientes de Supabase creados exitosamente')

// Helper para verificar la conexión (útil para health checks)
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    return !error
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

// Helper para obtener usuario desde token (usado en middleware)
export const getUserFromToken = async (token: string) => {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  return { user, error }
}

// Exportar configuraciones por si se necesitan
export const supabaseConfig = {
  url: requiredEnvVars.SUPABASE_URL!,
  anonKey: requiredEnvVars.SUPABASE_ANON_KEY!,
}

// Log de configuración exitosa
console.log('✅ Supabase clients initialized successfully')
console.log(`📍 URL: ${requiredEnvVars.SUPABASE_URL}`)
console.log(`🔑 Anon Key: ${requiredEnvVars.SUPABASE_ANON_KEY?.substring(0, 20)}...`)
console.log('🎉 Configuración de Supabase completada')