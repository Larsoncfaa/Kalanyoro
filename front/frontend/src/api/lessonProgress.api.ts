
import api from "./axios";

// =========================================================
// TYPES
// =========================================================

export interface StudentLessonProgress {
  id: number;
  student: number;
  lesson: number;

  student_name?: string;
  lesson_title?: string;

  status: string;
  score?: number | null;
  notes?: string | null;

  started_at?: string | null;
  completed_at?: string | null;
  validated_at?: string | null;

  created_at?: string;
  updated_at?: string;
}

// =========================================================
// PAGINATION
// =========================================================

interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// =========================================================
// LISTE DES PROGRESSIONS
// =========================================================

export const getLessonProgress = async (
  params?: {
    student?: number;
    lesson?: number;
    status?: string;
  }
): Promise<StudentLessonProgress[]> => {
  const response = await api.get<
    PaginatedResponse<StudentLessonProgress> | StudentLessonProgress[]
  >("lesson-progress/", {
    params,
  });

  const data = response.data;

  return Array.isArray(data) ? data : data.results;
};

// =========================================================
// UNE PROGRESSION
// =========================================================

export const getLessonProgressById = async (
  id: number
): Promise<StudentLessonProgress> => {
  const response = await api.get<StudentLessonProgress>(
    `lesson-progress/${id}/`
  );

  return response.data;
};

// =========================================================
// CRÉER UNE PROGRESSION
// =========================================================

export const createLessonProgress = async (
  payload: Partial<StudentLessonProgress>
): Promise<StudentLessonProgress> => {
  const response = await api.post<StudentLessonProgress>(
    "lesson-progress/",
    payload
  );

  return response.data;
};

// =========================================================
// MODIFIER UNE PROGRESSION
// =========================================================

export const updateLessonProgress = async (
  id: number,
  payload: Partial<StudentLessonProgress>
): Promise<StudentLessonProgress> => {
  const response = await api.patch<StudentLessonProgress>(
    `lesson-progress/${id}/`,
    payload
  );

  return response.data;
};

// =========================================================
// SUPPRIMER UNE PROGRESSION
// =========================================================

export const deleteLessonProgress = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `lesson-progress/${id}/`
  );

  return response.status === 204;
};

