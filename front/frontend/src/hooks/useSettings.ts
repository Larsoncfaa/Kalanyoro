import { useEffect, useState } from "react";

export interface AppSettings {
  // Thème et UI
  compactMode: boolean;
  darkMode: boolean;
  language: "fr" | "ar" | "en";
  pageSize: 10 | 20 | 50 | 100;

  // Notifications
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  soundNotifications: boolean;

  // Sécurité
  rememberMe: boolean;
  sessionTimeout: 15 | 30 | 60 | 120; // minutes
  requirePasswordOnSensitiveActions: boolean;

  // Affichage
  showCompleted: boolean;
  showArchived: boolean;
  sortBy: "name" | "date" | "progress";
  sortOrder: "asc" | "desc";
}

const STORAGE_KEY = "gestion_coran_settings";
const DEFAULT_SETTINGS: AppSettings = {
  compactMode: false,
  darkMode: false,
  language: "fr",
  pageSize: 20,
  notificationsEnabled: true,
  emailNotifications: false,
  soundNotifications: false,
  rememberMe: true,
  sessionTimeout: 60,
  requirePasswordOnSensitiveActions: true,
  showCompleted: true,
  showArchived: false,
  sortBy: "name",
  sortOrder: "asc",
};

/**
 * Hook pour gérer les paramètres de l'application
 * Stocke les préférences dans localStorage
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Charger les paramètres du localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mettre à jour un paramètre
   */
  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Mettre à jour plusieurs paramètres à la fois
   */
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Réinitialiser aux paramètres par défaut
   */
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Exporter les paramètres (pour sauvegarde)
   */
  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  /**
   * Importer les paramètres (depuis une sauvegarde)
   */
  const importSettings = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      updateSettings(parsed);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'import des paramètres:", error);
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };
}
