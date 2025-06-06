import { createClient } from '@supabase/supabase-js'

const requiredEnvVars = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

export const supabase = createClient(
  requiredEnvVars.SUPABASE_URL!,
  requiredEnvVars.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)

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

export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    return !error
  } catch {
    return false
  }
}

export const getUserFromToken = async (token: string) => {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  return { user, error }
}

export const supabaseConfig = {
  url: requiredEnvVars.SUPABASE_URL!,
  anonKey: requiredEnvVars.SUPABASE_ANON_KEY!,
}