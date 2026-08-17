import api from "./axios";

export interface Student {
  id: number;
  matricule: string;
  full_name: string;
  phone?: string;
  address?: string;
  birth_date?: string | null;
  created_at?: string;
  age?: number | null;
}

export const getStudents = async (params?: any): Promise<{ results: Student[]; count?: number; next?: string | null; previous?: string | null }> => {
  const resp = await api.get("students/", { params });
  const data = resp.data;

  return {
    results: data.results ?? data,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
};

export const getStudent = async (id: number): Promise<Student> => {
  const resp = await api.get(`students/${id}/`);
  return resp.data;
};

export const createStudent = async (payload: Partial<Student>) => {
  const resp = await api.post("students/", payload);
  return resp.data;
};

export const updateStudent = async (id: number, payload: Partial<Student>) => {
  const resp = await api.patch(`students/${id}/`, payload);
  return resp.data;
};

export const deleteStudent = async (id: number) => {
  const resp = await api.delete(`students/${id}/`);
  return resp.status === 204;
};
