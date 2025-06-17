import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean
  
  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Responsive helper (futuro)
  initializeResponsive: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      
      // Actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarCollapsed: (collapsed: boolean) => set({ 
        sidebarCollapsed: collapsed 
      }),
      
      // Responsive initialization (para futuro uso)
      initializeResponsive: () => {
        if (typeof window !== 'undefined') {
          const isMobile = window.innerWidth < 1024
          if (isMobile && !get().sidebarCollapsed) {
            set({ sidebarCollapsed: true })
          }
        }
      }
    }),
    {
      name: 'ui-preferences', // localStorage key
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed })
    }
  )
) 