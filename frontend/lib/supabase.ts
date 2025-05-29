import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type User = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'TREASURER' | 'USER'
  phone?: string
  isActive: boolean
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    provider?: string
  }
}

export type Session = {
  access_token: string
  refresh_token: string
  user: User
} 