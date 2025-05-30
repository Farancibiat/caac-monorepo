import NavBar from '@/components/Navbar'
import Footer from '@/components/Footer'

const PublicLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
} 
export default PublicLayout;