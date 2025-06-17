'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth/store'
import { useUIStore } from '@/stores/ui-store'
import { sidebarConfig } from '@/config/sidebar-config'
import type { AuthRole } from '@/types/sidebar'

const DashboardSidebar = () => {
  const { user } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore()
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])

  // Responsive behavior - collapse on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed])

  // Auto-expandir sección activa
  useEffect(() => {
    const activeSection = Object.keys(sidebarConfig).find(key => 
      pathname.startsWith(sidebarConfig[key].base)
    )
    
    if (activeSection && !openSections.includes(activeSection)) {
      setOpenSections(prev => [...prev, activeSection])
    }
  }, [pathname, openSections])

  // Función para verificar si el usuario tiene los roles necesarios
  const hasRequiredRole = (roles?: AuthRole[]): boolean => {
    if (!roles || roles.length === 0) return true
    if (!user?.role) return false
    return roles.includes(user.role)
  }

  // Función para verificar si una ruta está activa
  const isActive = (basePath: string, itemPath?: string): boolean => {
    const fullPath = `${basePath}${itemPath || ''}`
    if (fullPath === '/app/dashboard') {
      return pathname === fullPath
    }
    return pathname.startsWith(fullPath)
  }

  // Función para alternar secciones abiertas
  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => 
      prev.includes(sectionKey)
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    )
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-white border-r border-neutral-200 shadow-lg transition-all duration-300 ease-in-out
        ${sidebarCollapsed 
          ? 'fixed -translate-x-full lg:relative lg:translate-x-0 lg:w-20 w-80' 
          : 'fixed translate-x-0 lg:relative w-80 lg:w-72'
        }
        fixed top-0 left-0 h-screen z-50 lg:relative lg:top-auto lg:left-auto lg:h-screen lg:z-auto
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
                <h2 className="font-semibold text-lg text-neutral-900">Panel de Control</h2>
              )}
              
              {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden lg:flex"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </Button>
              
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {Object.entries(sidebarConfig).map(([sectionKey, section]) => {
              // Filtrar secciones por roles
              if (!hasRequiredRole(section.roles)) {
                return null
              }

              const isCurrentSectionActive = pathname.startsWith(section.base)
              const isSectionOpen = openSections.includes(sectionKey)

              // Item simple sin submenús
              if (!section.submenus) {
                const fullPath = `${section.base}${section.path || ''}`
                const itemActive = isActive(section.base, section.path)

                return (
                  <Link key={sectionKey} href={fullPath}>
              <Button
                      variant={itemActive ? "default" : "ghost"}
                className={`
                  w-full justify-start text-left
                  ${sidebarCollapsed ? 'px-2' : 'px-3'}
                        ${itemActive 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'hover:bg-neutral-100 text-neutral-700'
                        }
                        transition-colors
                      `}
                    >
                      <div className="flex items-center">
                        {section.icon}
                {!sidebarCollapsed && (
                          <span className="ml-3">{section.title}</span>
                )}
                      </div>
              </Button>
            </Link>
                )
              }

              // Item con submenús
              return (
                <div key={sectionKey}>
                  <Collapsible
                    open={isSectionOpen}
                    onOpenChange={() => toggleSection(sectionKey)}
                  >
                    <CollapsibleTrigger asChild>
                <Button
                        variant={isCurrentSectionActive ? "default" : "ghost"}
                  className={`
                          w-full justify-between text-left
                    ${sidebarCollapsed ? 'px-2' : 'px-3'}
                          ${isCurrentSectionActive 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'hover:bg-neutral-100 text-neutral-700'
                    }
                    transition-colors
                  `}
                >
                  <div className="flex items-center">
                          {section.icon}
                          {!sidebarCollapsed && (
                            <span className="ml-3">{section.title}</span>
                          )}
                        </div>
                    {!sidebarCollapsed && (
                          isSectionOpen 
                            ? <ChevronDown className="h-4 w-4" /> 
                            : <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    {!sidebarCollapsed && (
                      <CollapsibleContent className="space-y-1 mt-1">
                        {section.submenus.map((submenu) => {
                          // Filtrar submenús por roles
                          if (!hasRequiredRole(submenu.roles)) {
                            return null
                          }

                          const submenuPath = `${section.base}${submenu.path}`
                          const isSubmenuActive = pathname === submenuPath

                          return (
                            <Link key={submenu.path} href={submenuPath}>
                              <Button
                                variant={isSubmenuActive ? "default" : "ghost"}
                                size="sm"
                                className={`
                                  w-full justify-start ml-6 text-left
                                  ${isSubmenuActive 
                                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                    : 'hover:bg-neutral-100 text-neutral-700'
                                  }
                                  transition-colors
                                `}
                              >
                                {submenu.label}
                              </Button>
                            </Link>
                          )
                        })}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                  </div>
              )
            })}
          </nav>

          {/* User Info */}
          {!sidebarCollapsed && user && (
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default DashboardSidebar 