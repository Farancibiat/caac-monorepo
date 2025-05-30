import { supabaseClient } from '../auth/clients'
import type { AuthUser } from '../auth/types'
import type { UserProfile } from './types'

/**
 * Obtiene el perfil del usuario desde la tabla custom users
 */
export const getUserProfile = async (authUser: AuthUser): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

/**
 * Crea o actualiza el perfil del usuario
 * Útil como fallback si el trigger automático falla
 */
export const upsertUserProfile = async (authUser: AuthUser): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .upsert({
        auth_id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
        avatar_url: authUser.user_metadata?.avatar_url,
        provider: authUser.app_metadata?.provider || 'email',
        provider_id: authUser.user_metadata?.provider_id,
        role: 'USER',
        isActive: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'auth_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in upsertUserProfile:', error)
    return null
  }
}

/**
 * Actualiza el perfil del usuario
 */
export const updateUserProfile = async (
  authId: string, 
  updates: Partial<Pick<UserProfile, 'name' | 'phone' | 'avatarUrl'>>
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', authId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    return null
  }
}

/**
 * Verifica si un usuario tiene los permisos necesarios
 */
export const hasRole = (profile: UserProfile | null, requiredRole: UserProfile['role']): boolean => {
  if (!profile) return false
  
  const roleHierarchy = {
    'USER': 1,
    'TREASURER': 2,
    'ADMIN': 3
  }
  
  return roleHierarchy[profile.role] >= roleHierarchy[requiredRole]
}

/**
 * Obtiene información completa del usuario (auth + perfil)
 */
export const getCompleteUserInfo = async (authUser: AuthUser) => {
  const profile = await getUserProfile(authUser)
  
  // Si no existe el perfil, intentar crearlo (fallback)
  if (!profile) {
    console.log('Profile not found, attempting to create...')
    const newProfile = await upsertUserProfile(authUser)
    return {
      auth: authUser,
      profile: newProfile
    }
  }
  
  return {
    auth: authUser,
    profile
  }
} 