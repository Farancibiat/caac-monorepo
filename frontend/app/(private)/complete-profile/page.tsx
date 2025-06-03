"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import { useRouting } from "@/hooks/useRouting";

const CompleteProfilePage = () => {
  const { redirect, routes } = useRouting();

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Completa tu perfil</h1>
      <ProfileForm
        mode="registro"
        onSuccess={() => redirect(routes.DASHBOARD)}
      />
    </div>
  );
}
export default CompleteProfilePage;
