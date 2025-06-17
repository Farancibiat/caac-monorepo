import NavBar from '@/components/Navbar'
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar'
import SidebarToggleButton from '@/components/Dashboard/SidebarToggleButton'

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 overflow-hidden">
      {/* Navbar superior fijo */}
      <NavBar />
      
      {/* Botón flotante para abrir sidebar en mobile */}
      <SidebarToggleButton />
      
      {/* Container principal debajo del navbar */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar colapsable */}
        <DashboardSidebar />
        
        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout; 