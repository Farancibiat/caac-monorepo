import { useMemo } from 'react';
import { 
  getRegiones, 
  getComunasByRegion, 
  isValidComunaForRegion 
} from '@/lib/regiones-comunas-helper';

interface UseRegionComunaReturn {
  regionOptions: string[];
  comunaOptions: string[];
  isValidComuna: (comuna: string) => boolean;
  shouldResetComuna: (currentComuna: string, newRegion: string) => boolean;
}

export const useRegionComuna = (selectedRegion?: string): UseRegionComunaReturn => {
  const regionOptions = useMemo(() => getRegiones(), []);
  
  const comunaOptions = useMemo(() => {
    return selectedRegion ? getComunasByRegion(selectedRegion) : [];
  }, [selectedRegion]);

  const isValidComuna = useMemo(() => (comuna: string): boolean => {
    if (!selectedRegion || !comuna) return true;
    return isValidComunaForRegion(comuna, selectedRegion);
  }, [selectedRegion]);

  const shouldResetComuna = useMemo(() => (currentComuna: string, newRegion: string): boolean => {
    if (!currentComuna || !newRegion) return false;
    return !isValidComunaForRegion(currentComuna, newRegion);
  }, []);

  return {
    regionOptions,
    comunaOptions,
    isValidComuna,
    shouldResetComuna
  };
}; 