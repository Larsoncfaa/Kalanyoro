import api from "./axios";
import type { AuthResponse } from "../types";

export interface LoginData {
  username: string;
  password: string;
}

/**
 * Authentification utilisateur
 * @param data Credentials (username, password)
 * @returns Access token, refresh token, et infos utilisateur
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("token/", data);
  return response.data;
};