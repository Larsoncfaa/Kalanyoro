import api from "./axios";

export type LevelValidationStatus =
  | "PENDING"
  | "PASSED"
  | "FAILED";

export interface LevelValidationRecord {
  id: number;

  student: number;
  student_name: string;

  evaluated_by: number;

  practical_score: number | null;
  oral_score: number | null;

  level: number;
  level_name: string;

  status: LevelValidationStatus;

  score: number | null;
  notes: string | null;

  validated_at: string | null;

  can_access_next_level: boolean;
  next_level_name: string | null;
}

export interface LevelValidationPayload {
  student: number;
  level: number;

  practical_score?: number | null;
  oral_score?: number | null;

  status: LevelValidationStatus;

  score?: number | null;
  notes?: string | null;
}

/**
 * Récupérer toutes les validations.
 */
export const getLevelValidations = async (): Promise<
  LevelValidationRecord[]
> => {
  const response = await api.get("level-validations/");

  return response.data.results ?? response.data;
};

/**
 * Récupérer une validation.
 */
export const getLevelValidation = async (
  id: number
): Promise<LevelValidationRecord> => {
  const response = await api.get(
    `level-validations/${id}/`
  );

  return response.data;
};

/**
 * Créer une validation.
 */
export const createLevelValidation = async (
  payload: LevelValidationPayload
): Promise<LevelValidationRecord> => {
  const response = await api.post(
    "level-validations/",
    payload
  );

  return response.data;
};

/**
 * Modifier une validation.
 */
export const updateLevelValidation = async (
  id: number,
  payload: Partial<LevelValidationPayload>
): Promise<LevelValidationRecord> => {
  const response = await api.patch(
    `level-validations/${id}/`,
    payload
  );

  return response.data;
};

/**
 * Supprimer une validation.
 */
export const deleteLevelValidation = async (
  id: number
): Promise<void> => {
  await api.delete(
    `level-validations/${id}/`
  );
};