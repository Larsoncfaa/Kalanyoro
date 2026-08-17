/**
 * Types et Enums centralisés du projet Kalanyoro LMS
 * Synchronisé avec le backend Django
 */

// =========================================================
// RÔLES UTILISATEUR
// =========================================================

export type UserRole = "ADMIN" | "TEACHER";

export const UserRole = {
  ADMIN: "ADMIN" as const,
  TEACHER: "TEACHER" as const,
};

export const USER_ROLE_DISPLAY: Record<UserRole, string> = {
  ADMIN: "Administrateur",
  TEACHER: "Enseignant",
};

// =========================================================
// TYPES UTILISATEURS
// =========================================================

export interface CurrentUser {
  id: number;
  username: string;
  role: UserRole;
  phone?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export interface User extends CurrentUser {
  email?: string;
  is_staff?: boolean;
  created_at?: string;
}

// =========================================================
// TYPES D'SESSIONS DARASA
// =========================================================

export type SessionType = 
  | "QURAN"
  | "PRAYER"
  | "WUDU"
  | "TAJWEED"
  | "HADITH"
  | "FIQH"
  | "SIRAH"
  | "DUA"
  | "ARABIC";

export const SessionType = {
  QURAN: "QURAN" as const,
  PRAYER: "PRAYER" as const,
  WUDU: "WUDU" as const,
  TAJWEED: "TAJWEED" as const,
  HADITH: "HADITH" as const,
  FIQH: "FIQH" as const,
  SIRAH: "SIRAH" as const,
  DUA: "DUA" as const,
  ARABIC: "ARABIC" as const,
};

export const SESSION_TYPE_DISPLAY: Record<SessionType, string> = {
  QURAN: "Coran",
  PRAYER: "Prière",
  WUDU: "Ablution",
  TAJWEED: "Tajwid",
  HADITH: "Hadith",
  FIQH: "Fiqh",
  SIRAH: "Sira",
  DUA: "Invocations",
  ARABIC: "Arabe",
};

// =========================================================
// STATUTS DE PROGRESSION
// =========================================================

export type ProgressStatus = 
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REVIEW";

export const ProgressStatus = {
  NOT_STARTED: "NOT_STARTED" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  COMPLETED: "COMPLETED" as const,
  REVIEW: "REVIEW" as const,
};

export const PROGRESS_STATUS_DISPLAY: Record<ProgressStatus, string> = {
  NOT_STARTED: "Non démarrée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  REVIEW: "À revoir",
};

// =========================================================
// STATUTS D'ÉVALUATION
// =========================================================

export type EvaluationStatus = "PASSED" | "FAILED" | "PENDING";

export const EvaluationStatus = {
  PASSED: "PASSED" as const,
  FAILED: "FAILED" as const,
  PENDING: "PENDING" as const,
};

export const EVALUATION_STATUS_DISPLAY: Record<EvaluationStatus, string> = {
  PASSED: "Validé",
  FAILED: "Non validé",
  PENDING: "En attente",
};

// =========================================================
// VALIDATION DE NIVEAU
// =========================================================

export type LevelValidationStatus = "PENDING" | "PASSED" | "FAILED";

export const LevelValidationStatus = {
  PENDING: "PENDING" as const,
  PASSED: "PASSED" as const,
  FAILED: "FAILED" as const,
};

export const LEVEL_VALIDATION_STATUS_DISPLAY: Record<LevelValidationStatus, string> = {
  PENDING: "En attente",
  PASSED: "Validé",
  FAILED: "Échoué",
};

// =========================================================
// RÉPONSE API PAGINÉE
// =========================================================

export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// =========================================================
// RÉPONSE AUTHENTIFICATION
// =========================================================

export interface AuthResponse {
  access: string;
  refresh: string;
  user: CurrentUser;
}

// =========================================================
// ERREUR API
// =========================================================

export interface ApiError {
  status: number;
  data?: any;
  message: string;
}

// =========================================================
// UTILS POUR LES PERMISSIONS
// =========================================================

export const isAdmin = (user: CurrentUser | null): boolean => {
  return user?.role === UserRole.ADMIN;
};

export const isTeacher = (user: CurrentUser | null): boolean => {
  return user?.role === UserRole.TEACHER;
};
