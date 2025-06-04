"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import { useRouting } from "@/hooks/useRouting";
import { useAuthStore } from "@/stores/auth/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import RedirectMsj from "@/components/RedirectMsj";

const CompleteProfilePage = () => {
  const { redirect, routes } = useRouting();
  const { loading, profileCompleted } = useAuthStore();

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <RedirectMsj 
        message="Verificando estado del perfil"
        location="dashboard"
        variant="loading"
      />
    )
  }

  // Si el perfil ya está completo, redirigir al dashboard
  if (profileCompleted) {
    redirect(routes.DASHBOARD);
    return (
      <RedirectMsj 
        message="Perfil ya completado"
        location="dashboard"
        variant="success"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-ocean-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-primary-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-primary-800">
              Completa tu Perfil
            </CardTitle>
            <CardDescription className="text-neutral-600 text-lg">
              Para acceder a todas las funcionalidades del club, necesitas completar tu información básica
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-2">¿Por qué necesitamos esta información?</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-700">
                    <li>Para contactarte en caso de emergencias</li>
                    <li>Para personalizar tu experiencia en el club</li>
                    <li>Para cumplir con los requisitos de seguridad</li>
                    <li>Para enviarte información relevante sobre eventos</li>
                  </ul>
                </div>
              </div>
            </div>

            <ProfileForm
              mode="registro"
              onSuccess={() => {
                console.log('Profile completed successfully, redirecting to dashboard');
                redirect(routes.DASHBOARD);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CompleteProfilePage;
