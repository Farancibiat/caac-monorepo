import { REGIONES_COMUNAS } from '@/constants/regiones_comunas';

/**
 * Obtiene la lista de todas las regiones disponibles
 * @returns Array de strings con los nombres de las regiones
 */
export const getRegiones = (): string[] => {
  return REGIONES_COMUNAS.regiones.map(r => r.region);
};

/**
 * Obtiene las comunas correspondientes a una región específica
 * @param region - Nombre de la región
 * @returns Array de strings con los nombres de las comunas
 */
export const getComunasByRegion = (region: string): string[] => {
  const regionData = REGIONES_COMUNAS.regiones.find(r => r.region === region);
  return regionData ? regionData.comunas : [];
};

/**
 * Valida si una comuna pertenece a la región especificada
 * @param comuna - Nombre de la comuna
 * @param region - Nombre de la región
 * @returns true si la comuna pertenece a la región, false en caso contrario
 */
export const isValidComunaForRegion = (comuna: string, region: string): boolean => {
  const comunas = getComunasByRegion(region);
  return comunas.includes(comuna);
};

