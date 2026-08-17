import { useEffect, useState, useCallback } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users.api";

export function useTeachers(initialSearch = "") {
  const [teachers, setTeachers] = useState<any[]>([]);
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
      const params: any = { role: "TEACHER", page, page_size: pageSize };
      if (search) params.search = search;

      const resp = await getUsers(params);
      setTeachers(resp.results);
      setTotal(resp.count ?? resp.results.length);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des enseignants");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    load();
  }, [load]);

  const addTeacher = async (payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const teacher = await createUser(payload);
      await load();
      return teacher;
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création de l’enseignant");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTeacher = async (id: number, payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const teacher = await updateUser(id, payload);
      await load();
      return teacher;
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la mise à jour de l’enseignant");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTeacher = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteUser(id);
      await load();
      return true;
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la suppression de l’enseignant");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    teachers,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    reload: load,
    addTeacher,
    editTeacher,
    removeTeacher,
  };
}
