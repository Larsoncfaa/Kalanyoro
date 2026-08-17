import { useCallback, useEffect, useState } from "react";
import {
  getCurriculumLessons,
  getCurriculumLesson,
  type CurriculumLesson,
} from "../api/curriculum.api";

export function useCurriculumLessons(
  initialParams?: Record<string, any>
) {
  const [lessons, setLessons] = useState<CurriculumLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurriculumLessons(initialParams);
      setLessons(data);
    } catch (err: any) {
      setError(
        err?.message || "Impossible de charger les leçons du curriculum"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const getLesson = async (id: number) => {
    return await getCurriculumLesson(id);
  };

  return {
    lessons,
    loading,
    error,
    reload: load,
    getLesson,
  };
}