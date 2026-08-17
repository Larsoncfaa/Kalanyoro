import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export interface StudentCurriculumProgress {
  id: number;
  student: number;
  student_name?: string;
  competency: number;
  competency_title?: string;
  status: string;
  score?: number | null;
  notes?: string | null;
  validated_at?: string | null;
}

export function useCurriculumProgress(
  initialParams?: Record<string, any>
) {
  const [progress, setProgress] = useState<StudentCurriculumProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("curriculum-progress/", {
        params: initialParams,
      });

      setProgress(response.data.results ?? response.data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de charger la progression du curriculum"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProgress = async (
    id: number,
    data: Partial<StudentCurriculumProgress>
  ) => {
    const response = await api.patch(
      `curriculum-progress/${id}/`,
      data
    );

    await load();

    return response.data;
  };

  return {
    progress,
    loading,
    error,
    reload: load,
    updateProgress,
  };
}