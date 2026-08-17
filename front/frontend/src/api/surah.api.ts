import api from "./axios";

export interface Surah {
  id: number;
  number: number;
  name_ar: string;
  name_fr: string;
  total_verses: number;
}

export const getSurahs = async (params?: any): Promise<{ results: Surah[]; count?: number; next?: string | null; previous?: string | null }> => {
  const resp = await api.get("surahs/", { params });
  const data = resp.data;

  return {
    results: data.results ?? data,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
};

export const getSurah = async (id: number): Promise<Surah> => {
  const resp = await api.get(`surahs/${id}/`);
  return resp.data;
};
