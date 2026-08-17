import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export interface StudentGroup {
  id: number;
  name: string;
  description?: string;
  level: number;
  is_active: boolean;
}

export function useStudentGroups(
  initialParams?: Record<string, any>
) {
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("groups/", {
        params: initialParams,
      });

      setGroups(response.data.results ?? response.data);
    } catch (err: any) {
      setError(
        err?.message || "Impossible de charger les groupes"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const createGroup = async (data: Partial<StudentGroup>) => {
    const response = await api.post("groups/", data);
    await load();
    return response.data;
  };

  const updateGroup = async (
    id: number,
    data: Partial<StudentGroup>
  ) => {
    const response = await api.patch(`groups/${id}/`, data);
    await load();
    return response.data;
  };

  const deleteGroup = async (id: number) => {
    await api.delete(`groups/${id}/`);
    await load();
  };

  return {
    groups,
    loading,
    error,
    reload: load,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}