import { useCallback, useEffect, useState } from "react";
import {
  getCurriculumBooks,
  getCurriculumBook,
  type CurriculumBook,
} from "../api/curriculum.api";

export function useCurriculumBooks(initialParams?: Record<string, any>) {
  const [books, setBooks] = useState<CurriculumBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurriculumBooks(initialParams);
      setBooks(data);
    } catch (err: any) {
      setError(
        err?.message || "Impossible de charger les livres du curriculum"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const getBook = async (id: number) => {
    return await getCurriculumBook(id);
  };

  return {
    books,
    loading,
    error,
    reload: load,
    getBook,
  };
}