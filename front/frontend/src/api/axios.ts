import axios from "axios";
import { getAccessToken, getRefreshToken, saveAccessToken, removeTokens, removeUser } from "../utils/token";
import { handleApiError } from "../utils/errorHandler";

const API_BASE = import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// REQUEST INTERCEPTOR - Ajouter le token
// =========================================================

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================================================
// RESPONSE INTERCEPTOR - Gérer les erreurs et refresh
// =========================================================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cas 1: 401 → Essayer de refresh le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();

      if (!refresh) {
        removeTokens();
        removeUser();
        return Promise.reject(handleApiError(error));
      }

      try {
        const resp = await axios.post(`${API_BASE}token/refresh/`, { refresh });
        const { access } = resp.data;

        saveAccessToken(access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh échoué → Logout
        removeTokens();
        removeUser();
        return Promise.reject(handleApiError(refreshError));
      }
    }

    // Cas 2: Autres erreurs → Standardiser l'erreur
    return Promise.reject(handleApiError(error));
  }
);

export default api;