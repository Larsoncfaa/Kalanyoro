import { z } from "zod";

/**
 * Schémas de validation pour tous les payloads
 * Utilisés pour valider les données avant envoi au backend
 * 
 * À utiliser dans les formulaires:
 * try {
 *   const data = loginSchema.parse(formData);
 *   await login(data);
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     setErrors(error.flatten().fieldErrors);
 *   }
 * }
 */

// =========================================================
// AUTHENTIFICATION
// =========================================================

export const loginSchema = z.object({
  username: z
    .string("Le nom d'utilisateur est requis")
    .min(3, "Minimum 3 caractères")
    .max(150, "Maximum 150 caractères"),

  password: z
    .string("Le mot de passe est requis")
    .min(1, "Le mot de passe ne peut pas être vide"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// =========================================================
// UTILISATEURS (Admin)
// =========================================================

export const createUserSchema = z.object({
  username: z
    .string("Le nom d'utilisateur est requis")
    .min(3, "Minimum 3 caractères")
    .max(150, "Maximum 150 caractères"),

  password: z
    .string("Le mot de passe est requis")
    .min(8, "Minimum 8 caractères"),

  first_name: z
    .string("Le prénom est requis")
    .min(1, "Le prénom ne peut pas être vide")
    .max(150, "Maximum 150 caractères"),

  last_name: z
    .string("Le nom est requis")
    .min(1, "Le nom ne peut pas être vide")
    .max(150, "Maximum 150 caractères"),

  phone: z
    .string()
    .max(20, "Maximum 20 caractères")
    .optional(),

  role: z
    .enum(["ADMIN", "TEACHER"])
    .describe("Rôle invalide"),

  is_active: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .optional(),
  });

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// =========================================================
// ÉTUDIANTS
// =========================================================

export const createStudentSchema = z.object({
  full_name: z
    .string("Le nom complet est requis")
    .min(3, "Minimum 3 caractères")
    .max(255, "Maximum 255 caractères"),

  phone: z
    .string()
    .max(20, "Maximum 20 caractères")
    .optional(),

  address: z
    .string()
    .max(500, "Maximum 500 caractères")
    .optional(),

  birth_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Date invalide")
    .optional(),

  matricule: z
    .string()
    .max(50, "Maximum 50 caractères")
    .optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;

// =========================================================
// DARASA (Séances)
// =========================================================

export const createDarasaSchema = z.object({
  student: z
    .number("L'étudiant est requis")
    .positive("ID d'étudiant invalide"),

  session_type: z
    .enum([
      "QURAN",
      "PRAYER",
      "WUDU",
      "TAJWEED",
      "HADITH",
      "FIQH",
      "SIRAH",
      "DUA",
      "ARABIC",
    ] as const)
    .describe("Type de séance invalide"),

  lesson: z
    .number("La leçon est requise")
    .positive("ID de leçon invalide"),

  competency: z
    .number()
    .optional()
    .nullable(),

  surah: z
    .number()
    .optional()
    .nullable(),

  verse_start: z
    .number()
    .optional()
    .nullable(),

  verse_end: z
    .number()
    .optional()
    .nullable(),

  date: z
    .string("La date est requise")
    .refine((val) => !isNaN(Date.parse(val)), "Date invalide"),

  start_time: z
    .string("L'heure de début est requise")
    .refine((val) => /^\d{2}:\d{2}$/.test(val), "Format HH:MM requis"),

  end_time: z
    .string()
    .refine(
      (val) => /^\d{2}:\d{2}$/.test(val),
      "Format HH:MM requis"
    )
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(1000, "Maximum 1000 caractères")
    .optional(),
});

export const updateDarasaSchema = createDarasaSchema.partial();

export type CreateDarasaFormData = z.infer<typeof createDarasaSchema>;
export type UpdateDarasaFormData = z.infer<typeof updateDarasaSchema>;

// =========================================================
// CURRICULUM - NIVEAUX
// =========================================================

export const createCurriculumLevelSchema = z.object({
  level_number: z
    .number("Le numéro est requis")
    .positive("Numéro invalide"),

  name: z
    .string("Le nom est requis")
    .min(3, "Minimum 3 caractères")
    .max(255, "Maximum 255 caractères"),

  description: z
    .string("La description est requise")
    .min(10, "Minimum 10 caractères")
    .max(1000, "Maximum 1000 caractères"),

  is_active: z.boolean().default(true),
});

export const updateCurriculumLevelSchema = createCurriculumLevelSchema.partial();

export type CreateCurriculumLevelFormData = z.infer<
  typeof createCurriculumLevelSchema
>;
export type UpdateCurriculumLevelFormData = z.infer<
  typeof updateCurriculumLevelSchema
>;

// =========================================================
// CURRICULUM - MODULES
// =========================================================

export const createCurriculumModuleSchema = z.object({
  level: z
    .number("Le niveau est requis")
    .positive("ID de niveau invalide"),

  title: z
    .string("Le titre est requis")
    .min(3, "Minimum 3 caractères")
    .max(255, "Maximum 255 caractères"),

  description: z
    .string("La description est requise")
    .min(10, "Minimum 10 caractères")
    .max(1000, "Maximum 1000 caractères"),

  order: z
    .number("L'ordre est requis")
    .positive("Ordre invalide"),

  duration_minutes: z
    .number("La durée est requise")
    .positive("Durée invalide"),

  is_required: z.boolean().default(true),
});

export const updateCurriculumModuleSchema =
  createCurriculumModuleSchema.partial();

export type CreateCurriculumModuleFormData = z.infer<
  typeof createCurriculumModuleSchema
>;
export type UpdateCurriculumModuleFormData = z.infer<
  typeof updateCurriculumModuleSchema
>;

// =========================================================
// CURRICULUM - LEÇONS
// =========================================================

export const createCurriculumLessonSchema = z.object({
  module: z
    .number("Le module est requis")
    .positive("ID de module invalide"),

  title: z
    .string("Le titre est requis")
    .min(3, "Minimum 3 caractères")
    .max(255, "Maximum 255 caractères"),

  objectives: z
    .string("Les objectifs sont requis")
    .min(10, "Minimum 10 caractères"),

  description: z
    .string("La description est requise")
    .min(10, "Minimum 10 caractères")
    .max(1000, "Maximum 1000 caractères"),

  order: z
    .number("L'ordre est requis")
    .positive("Ordre invalide"),

  duration_minutes: z
    .number("La durée est requise")
    .positive("Durée invalide"),

  is_required: z.boolean().default(true),

  content: z
    .string()
    .max(5000, "Maximum 5000 caractères")
    .optional(),
});

export const updateCurriculumLessonSchema =
  createCurriculumLessonSchema.partial();

export type CreateCurriculumLessonFormData = z.infer<
  typeof createCurriculumLessonSchema
>;
export type UpdateCurriculumLessonFormData = z.infer<
  typeof updateCurriculumLessonSchema
>;

// =========================================================
// UTILITAIRE: Validateur générique
// =========================================================

/**
 * Valide des données contre un schéma Zod
 * Retourne {success, data, errors}
 */
export function validateData<T>(
  schema: z.ZodSchema,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string[]> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors as Record<string, string[]>;
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: ["Validation échouée"] },
    };
  }
}

/**
 * Formate les erreurs Zod pour affichage
 */
export function formatZodErrors(
  errors: Record<string, string[]>
): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors)) {
    formatted[field] = messages[0] || "Erreur de validation";
  }
  return formatted;
}
