/**
 * Normaliza un texto para comparación (sin acentos, minúsculas)
 * @param text - Texto a normalizar
 * @returns Texto normalizado
 */
export const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
  };