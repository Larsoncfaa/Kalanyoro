import { useEffect, useState } from "react";
import { getUser as getStoredUser, saveUser } from "../utils/token";
import * as usersApi from "../api/users.api";
import type { User } from "../api/users.api";
import type { CurrentUser } from "../types";

interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirm?: string;
}

/**
 * Hook pour gérer le profil utilisateur
 * Récupère, met à jour et valide les données du profil
 */
export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Charger le profil à l'initialisation
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUser = getStoredUser();
        if (!storedUser) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        const userData = await usersApi.getUser(storedUser.id);
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du profil"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /**
   * Mettre à jour le profil utilisateur
   */
  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!user) {
        throw new Error("Utilisateur non chargé");
      }

      // Valider les mots de passe si fournis
      if (payload.password) {
        if (!payload.password_confirm) {
          throw new Error("Veuillez confirmer le mot de passe");
        }
        if (payload.password !== payload.password_confirm) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
        if (payload.password.length < 8) {
          throw new Error(
            "Le mot de passe doit contenir au moins 8 caractères"
          );
        }
      }

      // Préparer le payload (sans password_confirm)
      const updatePayload: any = { ...payload };
      delete updatePayload.password_confirm;

      // Si pas de nouveau mot de passe, le supprimer du payload
      if (!payload.password) {
        delete updatePayload.password;
      }

      // Envoyer la mise à jour
      const updatedUser = await usersApi.updateUser(user.id, updatePayload);

      // Mettre à jour l'utilisateur local
      setUser(updatedUser);

      // Mettre à jour le localStorage si les infos de session ont changé
      const storedUser = getStoredUser();
      if (storedUser) {
        const updatedStoredUser: CurrentUser = {
          ...storedUser,
          username: updatedUser.username,
          first_name: updatedUser.first_name || "",
          last_name: updatedUser.last_name || "",
          role: updatedUser.role,
        };
        saveUser(updatedStoredUser);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); // Masquer le message après 5s
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Réinitialiser les messages
   */
  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    user,
    loading,
    error,
    success,
    updateProfile,
    clearMessages,
  };
}
