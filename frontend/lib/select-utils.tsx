import { normalizeText } from "./text-utils";

/**
 * Filtra una lista de opciones basándose en el texto de búsqueda
 * @param options - Array de opciones a filtrar
 * @param searchText - Texto de búsqueda
 * @returns Array filtrado de opciones que contienen el texto de búsqueda
 */
export const filterOptions = (options: string[], searchText: string): string[] => {
    if (!searchText.trim()) return options;
    
    const normalizedSearch = searchText.toLowerCase().trim();
    return options.filter(option => 
      option.toLowerCase().includes(normalizedSearch)
    );
  };
  
  
  
  /**
   * Filtra opciones con búsqueda más inteligente (sin acentos, case insensitive)
   * @param options - Array de opciones a filtrar
   * @param searchText - Texto de búsqueda
   * @returns Array filtrado de opciones
   */
  export const smartFilterOptions = (options: string[], searchText: string): string[] => {
    if (!searchText.trim()) return options;
    
    const normalizedSearch = normalizeText(searchText);
    return options.filter(option => 
      normalizeText(option).includes(normalizedSearch)
    );
  }; 