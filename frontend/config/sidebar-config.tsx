import { LayoutDashboard, Calendar, Users, Settings } from 'lucide-react';
import type { SidebarConfig } from '@/types/sidebar';

export const sidebarConfig: SidebarConfig = {
  dashboard: {
    title: "Dashboard",
    base: "/app/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "" // Item simple sin submenús
  },
  
  reservas: {
    title: "Reservas",
    base: "/app/reservas",
    icon: <Calendar className="h-5 w-5" />,
    submenus: [
      {
        label: "Mis Reservas",
        path: ""
      },
      {
        label: "Nueva Reserva", 
        path: "/nueva"
      }
    ]
  },

  administracion: {
    title: "Administración",
    base: "/app/admin",
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN', 'TREASURER'],
    submenus: [
      {
        label: "Panel General",
        path: ""
      },
      {
        label: "Usuarios",
        path: "/usuarios",
        roles: ['ADMIN']
      },
      {
        label: "Eventos",
        path: "/eventos"
      },
      {
        label: "Finanzas",
        path: "/finanzas",
        roles: ['ADMIN', 'TREASURER']
      }
    ]
  },

  configuraciones: {
    title: "Configuración",
    base: "/app/settings",
    icon: <Settings className="h-5 w-5" />,
    submenus: [
      {
        label: "Perfil",
        path: "/profile"
      },
      {
        label: "Preferencias",
        path: "/preferences"
      },
      {
        label: "Seguridad",
        path: "/security"
      },
      {
        label: "Avanzado",
        path: "/advanced",
        roles: ['ADMIN']
      }
    ]
  }
}; 