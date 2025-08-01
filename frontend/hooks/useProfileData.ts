import { useState, useCallback } from 'react';
import { reqClient } from '@/lib/api-client';
import type { ProfileApiData } from '@/types/api-responses/profile';
import type { ProfileFormData } from '@/types/forms/profile-form';

interface UseProfileDataReturn {
  profileData: ProfileApiData | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => Promise<{data: ProfileApiData}>;
  transformApiToForm: (apiData: ProfileApiData, getClubNameById: (id: number) => string) => ProfileFormData;
  transformFormToApi: (formData: ProfileFormData, getClubIdByName: (name: string) => number | null) => Omit<ProfileApiData, 'fechaNacimiento'> & { fechaNacimiento: Date; clubId: number | null };
}

export const useProfileData = (): UseProfileDataReturn => {
  const [profileData, setProfileData] = useState<ProfileApiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (): Promise<{data: ProfileApiData}> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await reqClient.get('/api/user/profile');
      if (!response.ok) {
        throw new Error(response.error || 'No se pudo cargar el perfil');
      }
      
      const data = response.data as ProfileApiData;
      setProfileData(data);
      return { data:data }; // ← Retorna los datos directamente
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const transformApiToForm = useCallback((
    apiData: ProfileApiData, 
    getClubNameById: (id: number) => string
  ): ProfileFormData => {
    const dateString = apiData.fechaNacimiento.split('T')[0];
    const [year, month, day] = dateString.split('-').map(Number);
    
    return {
      nombre: apiData.nombre,
      primerApellido: apiData.primerApellido,
      segundoApellido: apiData.segundoApellido,
      fechaNacimiento: new Date(year, month - 1, day),
      telefono: apiData.telefono,
      direccion: apiData.direccion,
      comuna: apiData.comuna,
      region: apiData.region,
      sexo: apiData.sexo,
      club: apiData.clubId ? getClubNameById(apiData.clubId) : ''
    };
  }, []);

  const transformFormToApi = useCallback((
    formData: ProfileFormData, 
    getClubIdByName: (name: string) => number | null
  ) => {
    return {
      nombre: formData.nombre,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      fechaNacimiento: formData.fechaNacimiento,
      telefono: formData.telefono,
      direccion: formData.direccion,
      comuna: formData.comuna,
      region: formData.region,
      sexo: formData.sexo,
      clubId: formData.club ? getClubIdByName(formData.club) : null
    };
  }, []);

  return {
    profileData,
    isLoading,
    error,
    loadProfile,
    transformApiToForm,
    transformFormToApi
  };
}; 