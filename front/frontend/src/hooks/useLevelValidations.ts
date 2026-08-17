import { useCallback, useEffect, useState } from "react";

import {
  getLevelValidations,
  createLevelValidation,
  updateLevelValidation,
  deleteLevelValidation,
  type LevelValidationRecord,
  type LevelValidationPayload,
} from "../api/levelValidation.api";

export function useLevelValidations() {
  const [validations, setValidations] = useState<
    LevelValidationRecord[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les validations
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getLevelValidations();

      setValidations(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Impossible de charger les validations de niveau."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recharger les validations
   */
  const reload = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  /**
   * Créer une validation
   */
  const createValidation = async (
    payload: LevelValidationPayload
  ) => {
    try {
      setError(null);

      const created = await createLevelValidation(
        payload
      );

      setValidations((prev) => [
        created,
        ...prev,
      ]);

      return created;
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Impossible de créer la validation."
      );

      throw err;
    }
  };

  /**
   * Modifier une validation
   */
  const updateValidation = async (
    id: number,
    payload: Partial<LevelValidationPayload>
  ) => {
    try {
      setError(null);

      const updated =
        await updateLevelValidation(
          id,
          payload
        );

      setValidations((prev) =>
        prev.map((item) =>
          item.id === id
            ? updated
            : item
        )
      );

      return updated;
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Impossible de modifier la validation."
      );

      throw err;
    }
  };

  /**
   * Supprimer une validation
   */
  const deleteValidation = async (
    id: number
  ) => {
    try {
      setError(null);

      await deleteLevelValidation(id);

      setValidations((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Impossible de supprimer la validation."
      );

      throw err;
    }
  };

  /**
   * Chargement initial
   */
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    validations,
    loading,
    error,

    createValidation,
    updateValidation,
    deleteValidation,

    reload,
  };
}