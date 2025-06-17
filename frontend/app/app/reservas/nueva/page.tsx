'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

const NuevaReservaPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={ROUTES.RESERVATIONS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Nueva Reserva</h1>
          <p className="text-neutral-600 mt-1">
            Reserva tu horario de piscina
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-primary-200 shadow-lg max-w-2xl">
        <CardHeader>
          <CardTitle className="text-primary-800 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Detalles de la Reserva
          </CardTitle>
          <CardDescription>
            Selecciona la fecha y horario para tu sesión de entrenamiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                className="border-neutral-300 focus:border-primary-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horario">Horario</Label>
              <select 
                id="horario"
                className="w-full h-10 px-3 border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Seleccionar horario</option>
                <option value="18:00-19:00">18:00 - 19:00</option>
                <option value="19:00-20:00">19:00 - 20:00</option>
                <option value="20:00-21:00">20:00 - 21:00</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <select 
              id="ubicacion"
              className="w-full h-10 px-3 border border-neutral-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Seleccionar piscina</option>
              <option value="principal">Piscina Principal</option>
              <option value="entrenamiento">Piscina de Entrenamiento</option>
            </select>
          </div>

          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary-800 mb-2 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Información Importante
            </h4>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Las reservas deben hacerse con al menos 24 horas de anticipación</li>
              <li>• Cada sesión tiene una duración de 1 hora</li>
              <li>• Máximo 2 reservas activas por usuario</li>
              <li>• Cancelaciones gratuitas hasta 2 horas antes</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white">
              Confirmar Reserva
            </Button>
            <Link href={ROUTES.RESERVATIONS} className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NuevaReservaPage 