import api from "./axios";

export interface StudentProgress {
  id: number;
  student: number;
  student_name?: string;
  current_surah?: number | null;
  surah_name?: string | null;
  current_verse?: number;
  total_sessions?: number;
  updated_at?: string;
}

export const getProgressList = async (params?: any): Promise<{ results: StudentProgress[]; count?: number; next?: string | null; previous?: string | null }> => {
  const resp = await api.get("progress/", { params });
  const data = resp.data;

  return {
    results: data.results ?? data,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
};

export const getProgress = async (id: number): Promise<StudentProgress> => {
  const resp = await api.get(`progress/${id}/`);
  return resp.data;
};
