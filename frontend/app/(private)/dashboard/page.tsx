'use client'

import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, Calendar, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-ocean-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 text-club-shadow">
              Panel de Usuario
            </h1>
            <p className="text-neutral-600 mt-1">
              Bienvenido, {user.user_metadata?.full_name || user.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-primary-300 text-primary-700 hover:bg-primary-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="border-primary-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary-800 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nombre</label>
                <p className="text-neutral-900">{user.user_metadata?.full_name || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Email</label>
                <p className="text-neutral-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Proveedor</label>
                <p className="text-neutral-900 capitalize">{user.user_metadata?.provider || 'Google'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">ID de Usuario</label>
                <p className="text-neutral-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-primary-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Mis Reservas
              </CardTitle>
              <CardDescription>
                Ver y gestionar tus reservas de piscina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                Ver Reservas
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Nueva Reserva
              </CardTitle>
              <CardDescription>
                Reservar un nuevo horario de piscina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
                Reservar Ahora
              </Button>
            </CardContent>
          </Card>

          <Card className="border-ocean-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>
                Actualizar tu perfil y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-ocean-300 text-ocean-700 hover:bg-ocean-50">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        <Card className="border-primary-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary-800">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>✅ Autenticación con Google</span>
                <span className="text-primary-600 font-semibold">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🔄 Sistema de Reservas</span>
                <span className="text-accent-600 font-semibold">En Desarrollo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⏳ Sincronización con Backend</span>
                <span className="text-neutral-500 font-semibold">Pendiente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 