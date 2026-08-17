import type { CurrentUser } from "../types";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "current_user";

/**
 * Sauvegarde les tokens d'authentification
 * ⚠️ À MIGRER VERS httpOnly cookies pour éviter XSS
 */
export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_KEY);
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const saveAccessToken = (access: string): void => {
  localStorage.setItem(TOKEN_KEY, access);
};

/**
 * Sauvegarde les infos utilisateur
 * @param user Utilisateur actuel
 */
export const saveUser = (user: CurrentUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Récupère les infos utilisateur sauvegardées
 * @returns L'utilisateur ou null
 */
export const getUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    console.error("Erreur lors du parsing de l'utilisateur");
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};