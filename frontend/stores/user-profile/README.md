# 👤 Sistema User Profile - Guía de Uso

## 📋 Tabla de Contenidos

1. [Resumen](#resumen)
2. [Arquitectura](#arquitectura)
3. [Tipos de Usuario](#tipos-de-usuario)
4. [API del User Profile](#api-del-user-profile)
5. [Integración con Auth](#integración-con-auth)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Actualización de Perfiles](#actualización-de-perfiles)
8. [Manejo de Errores](#manejo-de-errores)
9. [Base de Datos](#base-de-datos)

## 🎯 Resumen

El sistema de **User Profile** maneja los datos extendidos del usuario más allá de la autenticación básica, incluyendo:

- ✅ Información personal completa
- ✅ Preferencias del usuario  
- ✅ Datos específicos del dominio (Club de Aguas Abiertas)
- ✅ Gestión de roles y permisos
- ✅ Integración con el sistema de autenticación
- ✅ Validación de datos y campos requeridos

## 🏗️ Arquitectura

```
stores/user-profile/
├── index.ts     # Exports principales 
├── types.ts     # Tipos TypeScript
└── api.ts       # Funciones API para User Profile
```

### **Separación de Responsabilidades**

```typescript
// 🔐 AUTH - Solo autenticación
import { useAuth } from '@/stores/auth'           // Usuario básico de Supabase

// 👤 PROFILE - Datos extendidos del usuario  
import { getUserProfile, updateUserProfile } from '@/stores/user-profile'
```

## 👥 Tipos de Usuario

### **UserProfile - Estructura Completa**

```typescript
interface UserProfile {
  // Identificación
  id: number
  supabase_user_id: string        // Link con auth.users
  
  // Información Personal
  first_name: string | null
  last_name: string | null
  full_name?: string              // Computed field
  phone?: string | null
  date_of_birth?: Date | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  
  // Dirección
  address?: string | null
  city?: string | null
  region?: string | null
  country?: string | null
  
  // Club Específico
  membership_number?: string | null
  membership_status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  medical_certificate_expires?: Date | null
  swimming_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  
  // Sistema
  role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
  email_verified: boolean
  profile_completed: boolean
  
  // Timestamps
  created_at: Date
  updated_at: Date
}
```

### **CreateUserProfileData - Para Nuevos Usuarios**

```typescript
interface CreateUserProfileData {
  supabase_user_id: string        // Requerido
  first_name: string              // Requerido
  last_name: string               // Requerido
  phone?: string
  date_of_birth?: Date
  emergency_contact_name?: string
  emergency_contact_phone?: string
  address?: string
  city?: string
  region?: string
  swimming_level?: SwimmingLevel
  // Otros campos opcionales...
}
```

### **UpdateUserProfileData - Para Actualizaciones**

```typescript
interface UpdateUserProfileData {
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: Date
  emergency_contact_name?: string
  emergency_contact_phone?: string
  address?: string
  city?: string
  region?: string
  swimming_level?: SwimmingLevel
  // Solo campos que se quieren actualizar
}
```

## 🔌 API del User Profile

### **Obtener Perfil de Usuario**

```typescript
import { getUserProfile } from '@/stores/user-profile'

// Por Supabase User ID (más común)
const profile = await getUserProfile(supabaseUserId)

// Por Database ID
const profile = await getUserProfile(databaseId, 'database')

// Ejemplo con manejo de errores
try {
  const profile = await getUserProfile(user.id)
  if (profile) {
    console.log('Perfil encontrado:', profile.full_name)
  } else {
    console.log('Usuario no tiene perfil completado')
  }
} catch (error) {
  console.error('Error al obtener perfil:', error)
}
```

### **Crear Perfil de Usuario**

```typescript
import { createUserProfile } from '@/stores/user-profile'

const newProfileData: CreateUserProfileData = {
  supabase_user_id: user.id,
  first_name: 'Juan',
  last_name: 'Pérez',
  phone: '+56912345678',
  swimming_level: 'INTERMEDIATE',
  city: 'Castro',
  region: 'Los Lagos'
}

try {
  const profile = await createUserProfile(newProfileData)
  console.log('Perfil creado:', profile)
} catch (error) {
  console.error('Error al crear perfil:', error)
}
```

### **Actualizar Perfil de Usuario**

```typescript
import { updateUserProfile } from '@/stores/user-profile'

const updates: UpdateUserProfileData = {
  phone: '+56987654321',
  swimming_level: 'ADVANCED',
  emergency_contact_name: 'María Pérez',
  emergency_contact_phone: '+56911111111'
}

try {
  const updatedProfile = await updateUserProfile(profileId, updates)
  console.log('Perfil actualizado:', updatedProfile)
} catch (error) {
  console.error('Error al actualizar perfil:', error)
}
```

### **Eliminar Perfil de Usuario**

```typescript
import { deleteUserProfile } from '@/stores/user-profile'

try {
  await deleteUserProfile(profileId)
  console.log('Perfil eliminado correctamente')
} catch (error) {
  console.error('Error al eliminar perfil:', error)
}
```

## 🔗 Integración con Auth

### **Hook Combinado - useUserWithProfile**

```typescript
'use client'

import { useAuth } from '@/stores/auth'
import { getUserProfile } from '@/stores/user-profile'
import { useEffect, useState } from 'react'

export const useUserWithProfile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && isAuthenticated) {
      setProfileLoading(true)
      getUserProfile(user.id)
        .then(setProfile)
        .catch(err => setError(err.message))
        .finally(() => setProfileLoading(false))
    }
  }, [user, isAuthenticated])

  return {
    user,                               // Usuario de auth
    profile,                           // Perfil extendido
    isAuthenticated,
    loading: authLoading || profileLoading,
    error,
    hasProfile: !!profile,
    profileCompleted: profile?.profile_completed || false
  }
}
```

### **Componente con Perfil Completo**

```typescript
'use client'

import { useUserWithProfile } from '@/hooks/useUserWithProfile'

export const ProfileDashboard = () => {
  const { 
    user, 
    profile, 
    loading, 
    error, 
    hasProfile, 
    profileCompleted 
  } = useUserWithProfile()

  if (loading) return <div>Cargando perfil...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No autenticado</div>

  if (!hasProfile) {
    return (
      <div>
        <h2>Completa tu perfil</h2>
        <p>Para acceder a todas las funciones, necesitas completar tu perfil.</p>
        <ProfileSetupForm supabaseUserId={user.id} />
      </div>
    )
  }

  return (
    <div>
      <h1>¡Bienvenido {profile.full_name}!</h1>
      <div className="profile-info">
        <p>Email: {user.email}</p>
        <p>Teléfono: {profile.phone}</p>
        <p>Nivel de nado: {profile.swimming_level}</p>
        <p>Membresía: {profile.membership_status}</p>
        <p>Rol: {profile.role}</p>
      </div>
      
      {!profileCompleted && (
        <div className="warning">
          <p>Tu perfil está incompleto. Por favor, completa todos los campos.</p>
          <button>Completar Perfil</button>
        </div>
      )}
    </div>
  )
}
```

## 📝 Ejemplos de Uso

### **Formulario de Configuración Inicial**

```typescript
'use client'

import { useState } from 'react'
import { createUserProfile } from '@/stores/user-profile'

interface ProfileSetupFormProps {
  supabaseUserId: string
  onComplete?: (profile: UserProfile) => void
}

export const ProfileSetupForm = ({ supabaseUserId, onComplete }: ProfileSetupFormProps) => {
  const [formData, setFormData] = useState<CreateUserProfileData>({
    supabase_user_id: supabaseUserId,
    first_name: '',
    last_name: '',
    phone: '',
    swimming_level: 'BEGINNER'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const profile = await createUserProfile(formData)
      onComplete?.(profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre *</label>
        <input
          type="text"
          value={formData.first_name}
          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label>Apellido *</label>
        <input
          type="text"
          value={formData.last_name}
          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label>Teléfono</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      
      <div>
        <label>Nivel de nado *</label>
        <select
          value={formData.swimming_level}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            swimming_level: e.target.value as SwimmingLevel 
          }))}
          required
        >
          <option value="BEGINNER">Principiante</option>
          <option value="INTERMEDIATE">Intermedio</option>
          <option value="ADVANCED">Avanzado</option>
          <option value="EXPERT">Experto</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando perfil...' : 'Crear Perfil'}
      </button>
    </form>
  )
}
```

### **Formulario de Edición de Perfil**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { updateUserProfile, getUserProfile } from '@/stores/user-profile'

interface ProfileEditFormProps {
  profileId: number
  onSuccess?: (profile: UserProfile) => void
}

export const ProfileEditForm = ({ profileId, onSuccess }: ProfileEditFormProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<UpdateUserProfileData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar perfil actual
    getUserProfile(profileId, 'database')
      .then(setProfile)
      .catch(console.error)
  }, [profileId])

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        swimming_level: profile.swimming_level,
        address: profile.address || '',
        city: profile.city || '',
        region: profile.region || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || ''
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const updatedProfile = await updateUserProfile(profileId, formData)
      onSuccess?.(updatedProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return <div>Cargando perfil...</div>

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={formData.first_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Apellido</label>
          <input
            type="text"
            value={formData.last_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Teléfono</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Nivel de nado</label>
          <select
            value={formData.swimming_level || 'BEGINNER'}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              swimming_level: e.target.value as SwimmingLevel 
            }))}
          >
            <option value="BEGINNER">Principiante</option>
            <option value="INTERMEDIATE">Intermedio</option>
            <option value="ADVANCED">Avanzado</option>
            <option value="EXPERT">Experto</option>
          </select>
        </div>
        
        <div className="col-span-2">
          <label>Dirección</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Ciudad</label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Región</label>
          <input
            type="text"
            value={formData.region || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Contacto de emergencia (nombre)</label>
          <input
            type="text"
            value={formData.emergency_contact_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
          />
        </div>
        
        <div>
          <label>Contacto de emergencia (teléfono)</label>
          <input
            type="tel"
            value={formData.emergency_contact_phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
          />
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar Perfil'}
      </button>
    </form>
  )
}
```

### **Componente de Info del Usuario**

```typescript
'use client'

import { useUserWithProfile } from '@/hooks/useUserWithProfile'

export const UserInfoCard = () => {
  const { user, profile, hasProfile } = useUserWithProfile()

  if (!user) return null

  return (
    <div className="user-info-card">
      <div className="avatar">
        <img 
          src={user.user_metadata?.avatar_url || '/default-avatar.png'} 
          alt="Avatar"
        />
      </div>
      
      <div className="info">
        <h3>{profile?.full_name || user.email}</h3>
        <p>{user.email}</p>
        
        {hasProfile && (
          <>
            <div className="badges">
              <span className={`role-badge ${profile.role.toLowerCase()}`}>
                {profile.role}
              </span>
              <span className={`status-badge ${profile.membership_status.toLowerCase()}`}>
                {profile.membership_status}
              </span>
              <span className={`level-badge ${profile.swimming_level.toLowerCase()}`}>
                {profile.swimming_level}
              </span>
            </div>
            
            {profile.membership_number && (
              <p>Membresía: {profile.membership_number}</p>
            )}
            
            {profile.phone && (
              <p>Tel: {profile.phone}</p>
            )}
          </>
        )}
        
        {!hasProfile && (
          <p className="warning">Perfil incompleto</p>
        )}
      </div>
    </div>
  )
}
```

## ❌ Manejo de Errores

### **Errores Comunes**

```typescript
// Error: Usuario no encontrado
catch (error) {
  if (error.message.includes('not found')) {
    // Usuario no tiene perfil -> mostrar formulario de setup
  }
}

// Error: Datos inválidos
catch (error) {
  if (error.message.includes('validation')) {
    // Mostrar errores de validación específicos
  }
}

// Error: Permisos insuficientes
catch (error) {
  if (error.message.includes('permission')) {
    // Usuario no puede editar este perfil
  }
}
```

### **Validación de Campos**

```typescript
const validateProfileData = (data: CreateUserProfileData): string[] => {
  const errors: string[] = []
  
  if (!data.first_name) errors.push('Nombre es requerido')
  if (!data.last_name) errors.push('Apellido es requerido')
  if (data.phone && !/^\+56\d{9}$/.test(data.phone)) {
    errors.push('Formato de teléfono inválido')
  }
  if (data.date_of_birth && data.date_of_birth > new Date()) {
    errors.push('Fecha de nacimiento no puede ser futura')
  }
  
  return errors
}
```

## 🗄️ Base de Datos

### **Estructura de la Tabla `user_profiles`**

```sql
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  supabase_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información Personal
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  
  -- Dirección
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Chile',
  
  -- Club Específico
  membership_number VARCHAR(50) UNIQUE,
  membership_status membership_status_enum DEFAULT 'ACTIVE',
  medical_certificate_expires DATE,
  swimming_level swimming_level_enum DEFAULT 'BEGINNER',
  
  -- Sistema
  role user_role_enum DEFAULT 'USER',
  email_verified BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Triggers Automáticos**

```sql
-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calcular profile_completed automáticamente
CREATE OR REPLACE FUNCTION calculate_profile_completed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completed = (
    NEW.first_name IS NOT NULL AND
    NEW.last_name IS NOT NULL AND
    NEW.phone IS NOT NULL AND
    NEW.date_of_birth IS NOT NULL AND
    NEW.emergency_contact_name IS NOT NULL AND
    NEW.emergency_contact_phone IS NOT NULL
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_user_profile_completed 
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION calculate_profile_completed();
```

---

¡El sistema de User Profile está listo para gestionar toda la información extendida de los usuarios! 🎉 