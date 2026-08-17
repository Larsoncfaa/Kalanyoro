import { useEffect, useState } from "react";
import { getUser } from "../utils/token";
import type { CurrentUser } from "../types";

/**
 * Hook pour récupérer l'utilisateur actuellement connecté
 * Vérifie le localStorage et décode les infos d'authentification
 */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  return { user, loading };
}
