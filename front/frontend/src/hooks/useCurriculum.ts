
import { useEffect, useState } from "react";
import api from "../api/axios";

import type {
  CurriculumLevel,
} from "../api/curriculum.api";

export function useCurriculum() {
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("curriculum-levels/");

      const data = response.data;

      setLevels(data.results ?? data);
    } catch (err: any) {
      setError(
        err?.message || "Impossible de charger le curriculum"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  return {
    levels,
    loading,
    error,
    reload: fetchCurriculum,
  };
}

