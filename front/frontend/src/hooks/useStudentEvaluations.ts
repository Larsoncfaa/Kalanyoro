import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export interface StudentEvaluation {
  id: number;
  student: number;
  student_name?: string;
  competency: number;
  competency_title?: string;
  status: string;
  score?: number | null;
  notes?: string | null;
}

export function useStudentEvaluations(
  initialParams?: Record<string, any>
) {
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("evaluations/", {
        params: initialParams,
      });

      setEvaluations(response.data.results ?? response.data);
    } catch (err: any) {
      setError(
        err?.message || "Impossible de charger les évaluations"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const createEvaluation = async (
    data: Partial<StudentEvaluation>
  ) => {
    const response = await api.post("evaluations/", data);
    await load();
    return response.data;
  };

  const updateEvaluation = async (
    id: number,
    data: Partial<StudentEvaluation>
  ) => {
    const response = await api.patch(
      `evaluations/${id}/`,
      data
    );

    await load();

    return response.data;
  };

  return {
    evaluations,
    loading,
    error,
    reload: load,
    createEvaluation,
    updateEvaluation,
  };
}