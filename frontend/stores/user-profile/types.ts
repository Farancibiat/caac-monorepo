export interface UserProfile {
  id: number
  authId: string
  email: string | null
  name: string | null
  role: 'ADMIN' | 'TREASURER' | 'USER'
  phone: string | null
  isActive: boolean
  avatarUrl: string | null
  provider: string | null
  providerId: string | null
  createdAt: string
  updatedAt: string
} 