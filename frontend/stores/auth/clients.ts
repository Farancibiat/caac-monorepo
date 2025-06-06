import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso en componentes client (con realtime deshabilitado)
export const supabaseClient = createBrowserClient(
  supabaseUrl, 
  supabaseAnonKey
)