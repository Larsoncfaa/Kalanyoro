import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export interface StudentGroupMembership {
  id: number;
  student: number;
  student_name?: string;
  group: number;
  group_name?: string;
}

export function useGroupMemberships(
  initialParams?: Record<string, any>
) {
  const [memberships, setMemberships] = useState<
    StudentGroupMembership[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("group-memberships/", {
        params: initialParams,
      });

      setMemberships(response.data.results ?? response.data);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de charger les membres des groupes"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const addMember = async (
    data: Partial<StudentGroupMembership>
  ) => {
    const response = await api.post(
      "group-memberships/",
      data
    );

    await load();

    return response.data;
  };

  const removeMember = async (id: number) => {
    await api.delete(`group-memberships/${id}/`);

    await load();
  };

  return {
    memberships,
    loading,
    error,
    reload: load,
    addMember,
    removeMember,
  };
}