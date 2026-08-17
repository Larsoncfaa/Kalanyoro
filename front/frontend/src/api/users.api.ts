import api from "./axios";
import type { UserRole } from "../types";

// =========================================================
// TYPES
// =========================================================

export interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  email?: string;
  created_at?: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  is_active?: boolean;
  email?: string;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
  email?: string;
}

export interface UserListResponse {
  results: User[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// =========================================================
// API ENDPOINTS
// =========================================================

/**
 * Lister tous les utilisateurs (Admin only)
 */
export const getUsers = async (params?: any): Promise<UserListResponse> => {
  const resp = await api.get("users/", { params });
  const data = resp.data;

  return {
    results: data.results ?? data,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
};

/**
 * Récupérer un utilisateur spécifique
 */
export const getUser = async (id: number): Promise<User> => {
  const resp = await api.get(`users/${id}/`);
  return resp.data as User;
};

/**
 * Créer un nouvel utilisateur (Admin only)
 */
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const resp = await api.post("users/", payload);
  return resp.data as User;
};

/**
 * Modifier un utilisateur (Admin only)
 */
export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<User> => {
  const resp = await api.patch(`users/${id}/`, payload);
  return resp.data as User;
};

/**
 * Supprimer un utilisateur (Admin only)
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  const resp = await api.delete(`users/${id}/`);
  return resp.status === 204;
};
