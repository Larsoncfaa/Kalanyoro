
import api from "./axios";

// =========================================================
// TYPES
// =========================================================

export interface CurriculumBookContent {
  id: number;
  section: number;
  title: string;
  content_type: string;
  content: string;
  order: number;
  is_required: boolean;
}

export interface CurriculumBookSection {
  id: number;
  book: number;
  title: string;
  description: string;
  order: number;
  contents: CurriculumBookContent[];
}

export interface CurriculumBook {
  id: number;
  title: string;
  author: string;
  description: string;
  level: number;
  level_name: string;
  language: string;
  is_active: boolean;
  created_at: string;
  sections: CurriculumBookSection[];
}

export interface LessonBookReference {
  id: number;
  lesson: number;
  book: number;
  book_title: string;
  section_start: number;
  section_title: string;
  instructions: string;
}

export interface CurriculumCompetency {
  id: number;
  lesson: number;
  title: string;
  description: string;
  order: number;
  validation_method: string;
  is_gate: boolean;
  created_at: string;
}

export interface CurriculumLesson {
  id: number;
  module: number;
  title: string;
  objectives: string;
  description: string;
  order: number;
  duration_minutes: number;
  is_required: boolean;
  content: string;
  created_at: string;
  competencies: CurriculumCompetency[];
  book_references: LessonBookReference[];
}

export interface CurriculumModule {
  id: number;
  level: number;
  title: string;
  description: string;
  order: number;
  duration_minutes: number;
  is_required: boolean;
  created_at: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumLevel {
  id: number;
  level_number: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  modules: CurriculumModule[];
  books: CurriculumBook[];
}

export interface StudentCurriculumProgress {
  id: number;
  student: number;
  competency: number;
  student_name?: string;
  competency_title?: string;
  status: string;
  score?: number | null;
  notes?: string | null;
  validated_at?: string | null;
}

// =========================================================
// UTILITAIRE PAGINATION
// =========================================================

interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// =========================================================
// NIVEAUX
// =========================================================

export const getCurriculumLevels = async (): Promise<CurriculumLevel[]> => {
  const response = await api.get<PaginatedResponse<CurriculumLevel> | CurriculumLevel[]>(
    "curriculum-levels/"
  );

  const data = response.data;

  return Array.isArray(data) ? data : data.results;
};

export const createCurriculumLevel = async (
  payload: {
    level_number: number;
    name: string;
    description: string;
    is_active: boolean;
  }
): Promise<CurriculumLevel> => {
  const response = await api.post<CurriculumLevel>(
    "curriculum-levels/",
    payload
  );

  return response.data;
};


export const updateCurriculumLevel = async (
  id: number,
  payload: {
    level_number?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
  }
): Promise<CurriculumLevel> => {
  const response = await api.patch<CurriculumLevel>(
    `curriculum-levels/${id}/`,
    payload
  );

  return response.data;
};


export const deleteCurriculumLevel = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `curriculum-levels/${id}/`
  );

  return response.status === 204;
};

export const getCurriculumLevel = async (
  id: number
): Promise<CurriculumLevel> => {
  const response = await api.get<CurriculumLevel>(
    `curriculum-levels/${id}/`
  );

  return response.data;
};

// =========================================================
// MODULES
// =========================================================

export const getCurriculumModules = async (
  params?: {
    level?: number;
  }
): Promise<CurriculumModule[]> => {
  const response = await api.get<
    PaginatedResponse<CurriculumModule> | CurriculumModule[]
  >("curriculum-modules/", { params });

  const data = response.data;

  return Array.isArray(data) ? data : data.results;
};

export const getCurriculumModule = async (
  id: number
): Promise<CurriculumModule> => {
  const response = await api.get<CurriculumModule>(
    `curriculum-modules/${id}/`
  );

  return response.data;
};

// =========================================================
// LEÇONS
// =========================================================

export const getCurriculumLessons = async (
  params?: {
    module?: number;
  }
): Promise<CurriculumLesson[]> => {
  const response = await api.get<
    PaginatedResponse<CurriculumLesson> | CurriculumLesson[]
  >("curriculum-lessons/", { params });

  const data = response.data;

  return Array.isArray(data) ? data : data.results;
};

export const getCurriculumLesson = async (
  id: number
): Promise<CurriculumLesson> => {
  const response = await api.get<CurriculumLesson>(
    `curriculum-lessons/${id}/`
  );

  return response.data;
};

// =========================================================
// COMPÉTENCES
// =========================================================

export const getCurriculumCompetencies = async (
  params?: {
    module?: number;
    lesson?: number;
    is_gate?: boolean;
    validation_method?: string;
  }
): Promise<CurriculumCompetency[]> => {
  const response = await api.get<
    PaginatedResponse<CurriculumCompetency> | CurriculumCompetency[]
  >("curriculum-competencies/", { params });

  const data = response.data;

  return Array.isArray(data) ? data : data.results;
};

export const getCurriculumCompetency = async (
  id: number
): Promise<CurriculumCompetency> => {
  const response = await api.get<CurriculumCompetency>(
    `curriculum-competencies/${id}/`
  );

  return response.data;
};

// =========================================================
// PROGRESSION ÉTUDIANT
// =========================================================

export const getStudentCurriculumProgress = async (
  params?: {
    student?: number;
    competency?: number;
    status?: string;
  }
): Promise<StudentCurriculumProgress[]> => {
  const response = await api.get<
    PaginatedResponse<StudentCurriculumProgress> |
    StudentCurriculumProgress[]
  >("curriculum-progress/", { params });

  const data = response.data;

  return Array.isArray(data) ? data : data.results;
};

export const getStudentCurriculumProgressById = async (
  id: number
): Promise<StudentCurriculumProgress> => {
  const response = await api.get<StudentCurriculumProgress>(
    `curriculum-progress/${id}/`
  );

  return response.data;
};

export const updateStudentCurriculumProgress = async (
  id: number,
  payload: Partial<StudentCurriculumProgress>
): Promise<StudentCurriculumProgress> => {
  const response = await api.patch<StudentCurriculumProgress>(
    `curriculum-progress/${id}/`,
    payload
  );

  return response.data;
};

// =========================================================
// GROUPES
// =========================================================

export const getStudentGroups = async (
  params?: {
    level?: number;
    is_active?: boolean;
  }
) => {
  const response = await api.get("groups/", { params });
  return response.data.results ?? response.data;
};

export const getStudentGroupMemberships = async (
  params?: {
    group?: number;
    student?: number;
  }
) => {
  const response = await api.get("group-memberships/", { params });
  return response.data.results ?? response.data;
};

// =========================================================
// ÉVALUATIONS
// =========================================================

export const getStudentEvaluations = async (
  params?: {
    student?: number;
    competency?: number;
    status?: string;
  }
) => {
  const response = await api.get("evaluations/", { params });
  return response.data.results ?? response.data;
};

// =========================================================
// OBSERVATIONS
// =========================================================

export const getStudentObservations = async (
  params?: {
    student?: number;
    teacher?: number;
  }
) => {
  const response = await api.get("observations/", { params });
  return response.data.results ?? response.data;
};

// =========================================================
// VALIDATION DES NIVEAUX
// =========================================================

export const getLevelValidations = async (
  params?: {
    student?: number;
    level?: number;
    status?: string;
  }
) => {
  const response = await api.get("level-validations/", { params });
  return response.data.results ?? response.data;
};

// =========================================================
// SPÉCIALISATIONS
// =========================================================

export const getCurriculumSpecializations = async (
  params?: {
    level?: number;
    is_active?: boolean;
  }
) => {
  const response = await api.get("specializations/", { params });
  return response.data.results ?? response.data;
};

export const getStudentSpecializations = async (
  params?: {
    student?: number;
    specialization?: number;
    is_active?: boolean;
  }
) => {
  const response = await api.get("student-specializations/", { params });
  return response.data.results ?? response.data;
};

export const getCurriculumBooks = async (
  params?: Record<string, any>
): Promise<CurriculumBook[]> => {
  const response = await api.get("curriculum-books/", {
    params,
  });

  return response.data.results ?? response.data;
};

export const getCurriculumBook = async (
  id: number
): Promise<CurriculumBook> => {
  const response = await api.get(`curriculum-books/${id}/`);

  return response.data;
};

export const createCurriculumModule = async (
  payload: {
    level: number;
    title: string;
    description: string;
    order: number;
    duration_minutes: number;
    is_required: boolean;
  }
): Promise<CurriculumModule> => {
  const response = await api.post<CurriculumModule>(
    "curriculum-modules/",
    payload
  );

  return response.data;
};

export const updateCurriculumModule = async (
  id: number,
  payload: Partial<{
    level: number;
    title: string;
    description: string;
    order: number;
    duration_minutes: number;
    is_required: boolean;
  }>
): Promise<CurriculumModule> => {
  const response = await api.patch<CurriculumModule>(
    `curriculum-modules/${id}/`,
    payload
  );

  return response.data;
};

export const deleteCurriculumModule = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `curriculum-modules/${id}/`
  );

  return response.status === 204;
};

export const createCurriculumLesson = async (
  payload: {
    module: number;
    title: string;
    objectives: string;
    description: string;
    order: number;
    duration_minutes: number;
    is_required: boolean;
    content: string;
  }
): Promise<CurriculumLesson> => {
  const response = await api.post<CurriculumLesson>(
    "curriculum-lessons/",
    payload
  );

  return response.data;
};

export const updateCurriculumLesson = async (
  id: number,
  payload: Partial<{
    module: number;
    title: string;
    objectives: string;
    description: string;
    order: number;
    duration_minutes: number;
    is_required: boolean;
    content: string;
  }>
): Promise<CurriculumLesson> => {
  const response = await api.patch<CurriculumLesson>(
    `curriculum-lessons/${id}/`,
    payload
  );

  return response.data;
};

export const deleteCurriculumLesson = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `curriculum-lessons/${id}/`
  );

  return response.status === 204;
};
export const createCurriculumCompetency = async (
  payload: {
    lesson: number;
    title: string;
    description: string;
    order: number;
    validation_method: string;
    is_gate: boolean;
  }
): Promise<CurriculumCompetency> => {
  const response = await api.post<CurriculumCompetency>(
    "curriculum-competencies/",
    payload
  );

  return response.data;
};

export const updateCurriculumCompetency = async (
  id: number,
  payload: Partial<{
    lesson: number;
    title: string;
    description: string;
    order: number;
    validation_method: string;
    is_gate: boolean;
  }>
): Promise<CurriculumCompetency> => {
  const response = await api.patch<CurriculumCompetency>(
    `curriculum-competencies/${id}/`,
    payload
  );

  return response.data;
};

export const deleteCurriculumCompetency = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `curriculum-competencies/${id}/`
  );

  return response.status === 204;
};
export const createCurriculumBook = async (
  payload: {
    title: string;
    author: string;
    description: string;
    level: number;
    language: string;
    is_active: boolean;
  }
): Promise<CurriculumBook> => {
  const response = await api.post<CurriculumBook>(
    "curriculum-books/",
    payload
  );

  return response.data;
};

export const updateCurriculumBook = async (
  id: number,
  payload: Partial<{
    title: string;
    author: string;
    description: string;
    level: number;
    language: string;
    is_active: boolean;
  }>
): Promise<CurriculumBook> => {
  const response = await api.patch<CurriculumBook>(
    `curriculum-books/${id}/`,
    payload
  );

  return response.data;
};

export const deleteCurriculumBook = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `curriculum-books/${id}/`
  );

  return response.status === 204;
};
