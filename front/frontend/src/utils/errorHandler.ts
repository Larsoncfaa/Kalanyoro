import type { AxiosError } from "axios";
import type { ApiError } from "../types";

/**
 * Messages d'erreur localisés FR
 */
const ERROR_MESSAGES: Record<number | string, string> = {
  // Authentification
  401: "Session expirée. Veuillez vous reconnecter.",
  403: "Vous n'avez pas la permission d'accéder à cette ressource.",
  429: "Trop de tentatives. Veuillez réessayer plus tard.",

  // Validation
  400: "Données invalides. Veuillez vérifier votre saisie.",
  422: "Validation échouée. Certains champs sont invalides.",

  // Non trouvé
  404: "La ressource demandée n'existe pas.",

  // Erreur serveur
  500: "Erreur serveur. Veuillez réessayer plus tard.",
  502: "Service indisponible. Veuillez réessayer plus tard.",
  503: "Service en maintenance. Veuillez réessayer plus tard.",

  // Défaut
  NETWORK_ERROR: "Erreur réseau. Vérifiez votre connexion.",
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite.",
};

/**
 * Codes d'erreur standardisés
 */
export type ErrorCode = 
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "SESSION_EXPIRED"
  | "VALIDATION_ERROR"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

export const ErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED" as const,
  FORBIDDEN: "FORBIDDEN" as const,
  SESSION_EXPIRED: "SESSION_EXPIRED" as const,
  VALIDATION_ERROR: "VALIDATION_ERROR" as const,
  INVALID_INPUT: "INVALID_INPUT" as const,
  NOT_FOUND: "NOT_FOUND" as const,
  CONFLICT: "CONFLICT" as const,
  SERVER_ERROR: "SERVER_ERROR" as const,
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE" as const,
  NETWORK_ERROR: "NETWORK_ERROR" as const,
  TIMEOUT: "TIMEOUT" as const,
  UNKNOWN: "UNKNOWN" as const,
};

/**
 * Transforme une erreur Axios en ApiError standardisée
 */
export function handleApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<any>;

  if (!axiosError.response) {
    // Erreur réseau
    return {
      status: 0,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      data: {
        code: ErrorCode.NETWORK_ERROR,
        originalError: axiosError.message,
      },
    };
  }

  const { status, data } = axiosError.response;
  const message =
    data?.detail ||
    data?.message ||
    data?.error ||
    ERROR_MESSAGES[status] ||
    ERROR_MESSAGES.UNKNOWN_ERROR;

  // Déterminer le code d'erreur
 let code: ErrorCode = ErrorCode.UNKNOWN;;
  switch (status) {
    case 401:
      code = ErrorCode.UNAUTHORIZED;
      break;
    case 403:
      code = ErrorCode.FORBIDDEN;
      break;
    case 404:
      code = ErrorCode.NOT_FOUND;
      break;
    case 400:
    case 422:
      code = ErrorCode.VALIDATION_ERROR;
      break;
    case 409:
      code = ErrorCode.CONFLICT;
      break;
    case 429:
      code = ErrorCode.FORBIDDEN;
      break;
    case 500:
    case 502:
    case 503:
      code = ErrorCode.SERVER_ERROR;
      break;
  }

  return {
    status,
    message,
    data: {
      code,
      errors: data?.errors || data?.field_errors || {},
      details: data,
    },
  };
}

/**
 * Extrait les messages d'erreur d'un objet erreur
 * Utile pour les formulaires avec plusieurs champs
 */
export function getFieldErrors(errorData: any): Record<string, string> {
  if (!errorData) return {};

  // Format Django: {"field_name": ["error message"]}
  const fieldErrors: Record<string, string> = {};

  for (const [field, errors] of Object.entries(errorData)) {
    if (Array.isArray(errors)) {
      fieldErrors[field] = errors[0] || "Erreur de validation";
    } else if (typeof errors === "string") {
      fieldErrors[field] = errors;
    }
  }

  return fieldErrors;
}

/**
 * Vérifie si l'erreur est une erreur d'authentification
 */
export function isAuthError(error: ApiError): boolean {
  return (
    error.data?.code === ErrorCode.UNAUTHORIZED ||
    error.data?.code === ErrorCode.SESSION_EXPIRED ||
    error.status === 401
  );
}

/**
 * Vérifie si l'erreur est une erreur d'autorisation
 */
export function isForbiddenError(error: ApiError): boolean {
  return (
    error.data?.code === ErrorCode.FORBIDDEN ||
    error.status === 403
  );
}

/**
 * Vérifie si l'erreur est une validation
 */
export function isValidationError(error: ApiError): boolean {
  return (
    error.data?.code === ErrorCode.VALIDATION_ERROR ||
    error.status === 400 ||
    error.status === 422
  );
}

/**
 * Formate un message d'erreur pour affichage
 */
export function formatErrorMessage(error: ApiError): string {
  if (isValidationError(error)) {
    const fieldErrors = getFieldErrors(error.data?.errors);
    const messages = Object.values(fieldErrors);
    return messages.length > 0
      ? messages.join(", ")
      : error.message;
  }

  return error.message;
}
