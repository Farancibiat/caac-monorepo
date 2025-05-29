'use client'

import { useAuthStore } from '@/stores/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogOut, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function AuthStatus() {
  const { user, signOut, loading, error } = useAuthStore()

  if (loading) {
    return (
      <Card className="border-primary-200 shadow-lg">
        <CardContent className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
          <span className="text-neutral-600">Inicializando autenticación...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error de Autenticación
          </CardTitle>
          <CardDescription className="text-red-600">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => useAuthStore.getState().setError(null)}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Intentar de nuevo
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="border-primary-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary-800 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Usuario Autenticado
          </CardTitle>
          <CardDescription>
            Bienvenido, {user.user_metadata?.full_name || user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-neutral-600">Email: {user.email}</p>
            <p className="text-sm text-neutral-600">
              Proveedor: {user.user_metadata?.provider || 'Google'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/dashboard">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={signOut}
              variant="outline"
              disabled={loading}
              className="border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary-800">No Autenticado</CardTitle>
        <CardDescription>
          Inicia sesión para acceder a todas las funcionalidades del club
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/login">
          <Button className="w-full bg-accent-400 hover:bg-accent-500 text-accent-900 font-semibold">
            Iniciar Sesión con Google
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 