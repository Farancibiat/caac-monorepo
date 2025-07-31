"use client";
import ProfileForm from "@/components/profile/ProfileForm";

const EditProfilePage = () => {
  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar perfil</h1>
      <ProfileForm mode="edicion" />
    </div>
  );
}

export default EditProfilePage;
