import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export interface CurriculumSpecialization {
  id: number;
  level: number;
  level_name?: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export interface StudentSpecialization {
  id: number;
  student: number;
  student_name?: string;
  specialization: number;
  specialization_name?: string;
  started_at?: string;
  is_active: boolean;
  notes?: string;
}

export function useSpecializations(
  initialParams?: Record<string, any>
) {
  const [specializations, setSpecializations] = useState<
    CurriculumSpecialization[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        "curriculum-specializations/",
        {
          params: initialParams,
        }
      );

      setSpecializations(
        response.data.results ?? response.data
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de charger les spécialisations"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const createSpecialization = async (
    data: Partial<CurriculumSpecialization>
  ) => {
    const response = await api.post(
      "curriculum-specializations/",
      data
    );

    await load();

    return response.data;
  };

  return {
    specializations,
    loading,
    error,
    reload: load,
    createSpecialization,
  };
}