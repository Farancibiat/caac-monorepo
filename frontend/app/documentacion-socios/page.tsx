'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const DocumentacionSociosPage = () => {
  useEffect(() => {
    // TODO: Reemplazar con la URL real de Google Docs
    const googleDocsUrl = 'https://drive.google.com/drive/folders/0APCOjs63kzjwUk9PVA'
    
    // Redirección inmediata
    window.location.href = googleDocsUrl
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
        <h1 className="text-2xl font-bold text-primary-800">
          Redirigiendo a la documentación...
        </h1>
        <p className="text-neutral-600">
          Serás redirigido a Google Docs en un momento
        </p>
      </div>
    </div>
  )
}

export default DocumentacionSociosPage 