import { useEffect, useState, useCallback } from "react";
import { getProgressList } from "../api/progress.api";

export function useProgress(initialSearch = "") {
  const [progressList, setProgressList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState<number | null>(null);
  const [search, setSearch] = useState(initialSearch);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { page };
      if (search) params.search = search;

      const resp = await getProgressList(params);
      setProgressList(resp.results);
      setTotal(resp.count ?? resp.results.length);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des progressions");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    progressList,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    reload: load,
  };
}
