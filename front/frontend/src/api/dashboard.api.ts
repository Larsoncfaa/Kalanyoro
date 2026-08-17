import api from "./axios";

export interface DashboardStats {
  studentsCount: number;
  sessionsCount: number;
  progressCount: number;
  teachersCount: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [studentsResp, darasaResp, progressResp, teachersResp] = await Promise.all([
    api.get("students/", { params: { page_size: 1 } }),
    api.get("darasa/", { params: { page_size: 1 } }),
    api.get("progress/", { params: { page_size: 1 } }),
    api.get("users/", { params: { role: "TEACHER", page_size: 1 } }),
  ]);

  return {
    studentsCount: studentsResp.data.count ?? 0,
    sessionsCount: darasaResp.data.count ?? 0,
    progressCount: progressResp.data.count ?? 0,
    teachersCount: teachersResp.data.count ?? 0,
  };
};
