import { useEffect, useState, useCallback } from "react";
import { getSurahs } from "../api/surah.api";

export function useSurahs() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await getSurahs({ page_size: 200 });
      setSurahs(resp.results ?? []);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des sourates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    surahs,
    loading,
    error,
    reload: load,
  };
}
