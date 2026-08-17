
import api from "./axios";
import type { SessionType } from "../types";

// ============================================================
// TYPES
// ============================================================

export interface Darasa {
  id: number;

  // Utilisateurs
  teacher: number;
  teacher_name?: string;

  student: number;
  student_name?: string;

  // Type de séance
  session_type: SessionType;

  // Curriculum
  level_id?: number;
  level_number?: number;
  level_name?: string;

  module_id?: number;
  module_title?: string;

  lesson: number;
  lesson_title?: string;

  // Coran
  surah?: number | null;
  surah_name?: string | null;

  verse_start?: number | null;
  verse_end?: number | null;

  // Séance
  date: string;
  start_time: string;
  end_time?: string | null;

  notes?: string;

  created_at?: string;
}

// ============================================================
// PAYLOAD CRÉATION
// ============================================================

export interface CreateDarasaPayload {
  student: number;
  session_type: SessionType;
  lesson: number;
  competency?: number | null;

  surah?: number | null;
  verse_start?: number | null;
  verse_end?: number | null;

  date: string;
  start_time: string;
  end_time?: string | null;

  notes?: string;
}

// ============================================================
// PAYLOAD MODIFICATION
// ============================================================

export interface UpdateDarasaPayload {
  student?: number;
  session_type?: SessionType;

  lesson?: number;

  surah?: number | null;
  verse_start?: number | null;
  verse_end?: number | null;

  date?: string;
  start_time?: string;
  end_time?: string | null;

  notes?: string;
}

// ============================================================
// PAGINATION
// ============================================================

export interface DarasaListResponse {
  results: Darasa[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// ============================================================
// LISTE DES SÉANCES
// ============================================================

export const getDarasaList = async (
  params?: Record<string, unknown>
): Promise<DarasaListResponse> => {
  const response = await api.get("darasa/", {
    params,
  });

  const data = response.data;

  return {
    results: data.results ?? data,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
};

// ============================================================
// UNE SÉANCE
// ============================================================

export const getDarasa = async (
  id: number
): Promise<Darasa> => {
  const response = await api.get<Darasa>(
    `darasa/${id}/`
  );

  return response.data;
};

// ============================================================
// CRÉER UNE SÉANCE
// ============================================================

export const createDarasa = async (
  payload: CreateDarasaPayload
): Promise<Darasa> => {
  const response = await api.post<Darasa>(
    "darasa/",
    payload
  );

  return response.data;
};

// ============================================================
// MODIFIER UNE SÉANCE
// ============================================================

export const updateDarasa = async (
  id: number,
  payload: UpdateDarasaPayload
): Promise<Darasa> => {
  const response = await api.patch<Darasa>(
    `darasa/${id}/`,
    payload
  );

  return response.data;
};

// ============================================================
// SUPPRIMER UNE SÉANCE
// ============================================================

export const deleteDarasa = async (
  id: number
): Promise<boolean> => {
  const response = await api.delete(
    `darasa/${id}/`
  );

  return response.status === 204;
};

