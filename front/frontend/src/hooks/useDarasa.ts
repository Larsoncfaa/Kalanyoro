
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createDarasa,
  deleteDarasa,
  getDarasaList,
  updateDarasa,
} from "../api/darasa.api";

import type {
  CreateDarasaPayload,
  Darasa,
  UpdateDarasaPayload,
} from "../api/darasa.api";

export function useDarasa(
  initialSearch = ""
) {
  // =========================================================
  // ÉTAT
  // =========================================================

  const [sessions, setSessions] = useState<Darasa[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [page, setPage] = useState(1);

  const [pageSize] = useState(20);

  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState(
    initialSearch
  );

  // =========================================================
  // FILTRES
  // =========================================================

  const [studentFilter, setStudentFilter] = useState<
    number | undefined
  >(undefined);

  const [lessonFilter, setLessonFilter] = useState<
    number | undefined
  >(undefined);

  const [sessionTypeFilter, setSessionTypeFilter] =
    useState<string | undefined>(undefined);

  // =========================================================
  // CHARGEMENT
  // =========================================================

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, unknown> = {
        page,
        page_size: pageSize,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (studentFilter !== undefined) {
        params.student = studentFilter;
      }

      if (lessonFilter !== undefined) {
        params.lesson = lessonFilter;
      }

      if (sessionTypeFilter) {
        params.session_type = sessionTypeFilter;
      }

      const response = await getDarasaList(
        params
      );

      setSessions(response.results);

      setTotal(
        response.count ?? response.results.length
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erreur lors du chargement des séances"
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    search,
    studentFilter,
    lessonFilter,
    sessionTypeFilter,
  ]);

  // =========================================================
  // CHARGEMENT INITIAL
  // =========================================================

  useEffect(() => {
    void load();
  }, [load]);

  // =========================================================
  // CRÉER
  // =========================================================

  const addSession = async (
    payload: CreateDarasaPayload
  ) => {
    setLoading(true);
    setError(null);

    try {
      const created = await createDarasa(
        payload
      );

      await load();

      return created;
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erreur lors de la création de la séance"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // MODIFIER
  // =========================================================

  const editSession = async (
    id: number,
    payload: UpdateDarasaPayload
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await updateDarasa(
        id,
        payload
      );

      setSessions((previous) =>
        previous.map((session) =>
          session.id === id
            ? updated
            : session
        )
      );

      return updated;
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erreur lors de la modification de la séance"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SUPPRIMER
  // =========================================================

  const removeSession = async (
    id: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDarasa(id);

      setSessions((previous) =>
        previous.filter(
          (session) => session.id !== id
        )
      );

      setTotal((previous) =>
        Math.max(0, previous - 1)
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Erreur lors de la suppression de la séance"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET DES FILTRES
  // =========================================================

  const resetFilters = () => {
    setSearch("");
    setStudentFilter(undefined);
    setLessonFilter(undefined);
    setSessionTypeFilter(undefined);
    setPage(1);
  };

  // =========================================================
  // RETOUR
  // =========================================================

  return {
    // Données
    sessions,

    // État
    loading,
    error,

    // Pagination
    page,
    setPage,
    pageSize,
    total,

    // Recherche
    search,
    setSearch,

    // Filtres
    studentFilter,
    setStudentFilter,

    lessonFilter,
    setLessonFilter,

    sessionTypeFilter,
    setSessionTypeFilter,

    // Actions
    addSession,
    editSession,
    removeSession,

    // Utilitaires
    reload: load,
    resetFilters,
  };
}

