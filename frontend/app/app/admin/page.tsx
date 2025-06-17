'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, Settings, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'

const AdminPage = () => {
  const adminStats = [
    {
      title: 'Usuarios Activos',
      value: '156',
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Reservas Hoy',
      value: '23',
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Horarios Disponibles',
      value: '12',
      icon: <Settings className="h-6 w-6" />,
      color: 'text-purple-600'
    },
    {
      title: 'Ocupación Promedio',
      value: '78%',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-orange-600'
    }
  ]

  const adminActions = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar cuentas de usuarios y permisos',
      href: '/admin/usuarios',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Gestión de Reservas',
      description: 'Ver y administrar todas las reservas',
      href: '/admin/reservas',
      icon: <Calendar className="h-8 w-8" />,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Configurar Horarios',
      description: 'Gestionar horarios y disponibilidad',
      href: '/admin/horarios',
      icon: <Settings className="h-8 w-8" />,
      color: 'bg-purple-50 text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Panel de Administración</h1>
          <p className="text-neutral-600 mt-1">
            Gestiona usuarios, reservas y configuraciones del club
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className="border-neutral-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminActions.map((action, index) => (
          <Card key={index} className="border-primary-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader>
              <div className={`w-16 h-16 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                {action.icon}
              </div>
              <CardTitle className="text-primary-800">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={action.href}>
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  Acceder
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-neutral-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary-800">Actividad Reciente</CardTitle>
          <CardDescription>Últimas acciones en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Nueva reserva creada</p>
                <p className="text-xs text-neutral-500">Usuario: maria.gonzalez@email.com - Hace 5 min</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Usuario registrado</p>
                <p className="text-xs text-neutral-500">Nuevo miembro: carlos.silva@email.com - Hace 15 min</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Reserva cancelada</p>
                <p className="text-xs text-neutral-500">Usuario: ana.torres@email.com - Hace 30 min</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPage 