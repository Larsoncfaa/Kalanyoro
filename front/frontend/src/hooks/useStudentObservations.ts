import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export interface StudentObservation {
  id: number;
  student: number;
  student_name?: string;
  teacher: number;
  teacher_name?: string;
  title: string;
  content?: string;
  created_at?: string;
}

export function useStudentObservations(
  initialParams?: Record<string, any>
) {
  const [observations, setObservations] = useState<StudentObservation[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("observations/", {
        params: initialParams,
      });

      setObservations(response.data.results ?? response.data);
    } catch (err: any) {
      setError(
        err?.message || "Impossible de charger les observations"
      );
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    load();
  }, [load]);

  const createObservation = async (
    data: Partial<StudentObservation>
  ) => {
    const response = await api.post("observations/", data);

    await load();

    return response.data;
  };

  const updateObservation = async (
    id: number,
    data: Partial<StudentObservation>
  ) => {
    const response = await api.patch(
      `observations/${id}/`,
      data
    );

    await load();

    return response.data;
  };

  const deleteObservation = async (id: number) => {
    await api.delete(`observations/${id}/`);

    await load();
  };

  return {
    observations,
    loading,
    error,
    reload: load,
    createObservation,
    updateObservation,
    deleteObservation,
  };
}