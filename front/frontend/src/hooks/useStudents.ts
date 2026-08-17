import { useEffect, useState, useCallback } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/students.api";

export function useStudents(initialSearch = "", initialPageSize = 20) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [total, setTotal] = useState<number | null>(null);
  const [search, setSearch] = useState(initialSearch);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { page, page_size: pageSize };
      if (search) params.search = search;

      const resp = await getStudents(params);
      setStudents(resp.results);
      setTotal(resp.count ?? resp.results.length);
    } catch (err: any) {
      const message = err?.message || "Erreur lors du chargement des étudiants";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    load();
  }, [load]);

  const addStudent = async (payload: any) => {
    await createStudent(payload);
    await load();
  };

  const editStudent = async (id: number, payload: any) => {
    await updateStudent(id, payload);
    await load();
  };

  const removeStudent = async (id: number) => {
    await deleteStudent(id);
    await load();
  };

  return {
    students,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    reload: load,
    addStudent,
    editStudent,
    removeStudent,
  };
}