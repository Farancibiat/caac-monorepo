'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, ChevronDown, Lock } from 'lucide-react'
import { cn } from '@/lib/shadcn-utils'
import { isPrivateRoute } from '@/lib/route-utils'
import { ROUTES } from '@/config/routes'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useAuthStore()
  const pathname = usePathname()

  // Detectar scroll para cambiar tamaño del navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  // Check if we're in a private route
  const isPrivateRouteCheck = isPrivateRoute(pathname)

  const navigation = [
    { name: 'Inicio', href: ROUTES.HOME },
    { name: 'Eventos', href: ROUTES.EVENTOS },
    { name: 'Galería', href: ROUTES.GALERIA },
    { name: 'Nosotros', href: ROUTES.NOSOTROS },
    { name: 'Contacto', href: ROUTES.CONTACTO },
  ]

  return (
    <nav className={cn(
      "bg-white/95 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50 shadow-sm transition-all duration-300 ease-in-out",
      isScrolled ? "shadow-lg border-neutral-200" : "shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex justify-between items-center transition-all duration-300 ease-in-out",
          isPrivateRouteCheck 
            ? "h-16" // Altura fija en rutas privadas
            : isScrolled ? "h-16" : "h-20 lg:h-24" // Comportamiento dinámico en rutas públicas
        )}>
          
          {/* Logo Horizontal */}
          <div className="flex-shrink-0">
            <Link href={ROUTES.HOME} className="flex items-center group">
              <div className={cn(
                "relative transition-all duration-300 ease-in-out overflow-hidden rounded-lg",
                isPrivateRouteCheck
                  ? "h-10 w-32 sm:h-12 sm:w-36" // Tamaño fijo en rutas privadas
                  : isScrolled 
                  ? "h-10 w-32 sm:h-12 sm:w-36" 
                  : "h-12 w-36 sm:h-14 sm:w-40 lg:h-16 lg:w-48"
              )}>
                <Image
                  src="/assets/logo horizontal.png"
                  alt="Club de Aguas Abiertas Chiloé"
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 192px"
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-neutral-700 hover:text-primary-700 relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    "hover:bg-primary-50 hover:shadow-sm",
                    "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-primary-600 before:scale-x-0 before:transition-transform before:duration-200",
                    "hover:before:scale-x-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 h-10 px-3 hover:bg-neutral-100 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-neutral-800 max-w-32 truncate font-medium">
                        {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {!isPrivateRouteCheck ? (
                    <DropdownMenuItem asChild>
                                              <Link href={ROUTES.DASHBOARD} className="flex items-center cursor-pointer">
                          <Lock className="mr-2 h-4 w-4" />
                          Sitio Privado
                        </Link>
                    </DropdownMenuItem>
                    ) : null}
                    {!isPrivateRouteCheck && <DropdownMenuSeparator />}
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href={ROUTES.AUTH.REGISTER}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-neutral-700 hover:text-primary-700 hover:bg-primary-50 font-medium px-4"
                  >
                    Registrarse
                  </Button>
                </Link>
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Main menu button */}
            <button
              onClick={toggleMenu}
              className="text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-4 space-y-1 bg-white/98 backdrop-blur-md border-t border-neutral-200/50 rounded-b-xl">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-neutral-700 hover:text-primary-700 hover:bg-primary-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-3 border-t border-neutral-200 mt-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-3 flex items-center space-x-3 bg-neutral-50 rounded-xl mx-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {user.user_metadata?.full_name || 'Usuario'}
                        </p>
                        <p className="text-xs text-neutral-600 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 px-2">
                      {!isPrivateRouteCheck && (
                                              <Link
                          href={ROUTES.DASHBOARD}
                          onClick={() => setIsMenuOpen(false)}
                        >
                        <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold justify-start">
                            <Lock className="h-4 w-4 mr-2" />
                            Sitio Privado
                        </Button>
                      </Link>
                      )}
                      <Button 
                        variant="ghost" 
                        onClick={handleSignOut}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-medium justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 px-2">
                    <Link href={ROUTES.AUTH.REGISTER} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full font-semibold">
                        Registrarse
                      </Button>
                    </Link>
                    <Link href={ROUTES.AUTH.LOGIN} onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar 