'use client'

import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth/store'
import { useUIStore } from '@/stores/ui-store'

const SidebarToggleButton = () => {
  const { user } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  // Only show when user is authenticated, on mobile, and when sidebar is collapsed
  // No need to check for private routes since this component is only used in private layout
  if (!user || !sidebarCollapsed) {
    return null
  }

  return (
    <Button
      onClick={toggleSidebar}
      className="fixed top-20 left-2 z-40 lg:hidden bg-white border border-neutral-200 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 p-0 rounded-full"
      aria-label="Abrir sidebar"
    >
      <ChevronRight className="h-5 w-5 text-neutral-700" />
    </Button>
  )
}

export default SidebarToggleButton 