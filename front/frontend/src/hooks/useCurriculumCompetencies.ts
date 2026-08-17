import { useCallback, useEffect, useState } from "react";
import {
  getCurriculumCompetencies,
  getCurriculumCompetency,
  type CurriculumCompetency,
} from "../api/curriculum.api";

export function useCurriculumCompetencies(
  initialParams?: Record<string, any>
) {
  const [competencies, setCompetencies] = useState<CurriculumCompetency[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurriculumCompetencies(initialParams);
      setCompetencies(data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de charger les compétences du curriculum"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const getCompetency = async (id: number) => {
    return await getCurriculumCompetency(id);
  };

  return {
    competencies,
    loading,
    error,
    reload: load,
    getCompetency,
  };
}