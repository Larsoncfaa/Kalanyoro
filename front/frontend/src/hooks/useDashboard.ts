import { useEffect, useState, useCallback } from "react";
import { getDashboardStats } from "../api/dashboard.api";
import type { DashboardStats } from "../api/dashboard.api";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement du tableau de bord");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, reload: load };
}
