/**
 * Resultado de validaciones de negocio
 * Usado por BusinessRulesService y otros validadores
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string; // Para mapear a mensajes específicos
}

/**
 * Helper para crear ValidationResult
 */
export const ValidationResultHelper = {
  valid: (): ValidationResult => ({
    isValid: true,
    errors: []
  }),

  invalid: (errors: ValidationError[]): ValidationResult => ({
    isValid: false,
    errors
  }),

  singleError: (field: string, message: string, code?: string): ValidationResult => ({
    isValid: false,
    errors: [{ field, message, ...(code !== undefined && { code }) }]
  })
} as const;