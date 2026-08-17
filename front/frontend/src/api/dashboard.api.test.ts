import { describe, expect, it, vi, beforeEach } from "vitest";

const mockGet = vi.fn();

vi.mock("./axios", () => ({
  default: {
    get: mockGet,
  },
}));

import { getDashboardStats } from "./dashboard.api";

describe("getDashboardStats", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("returns zeroed stats when the teachers count request is forbidden", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url === "students/") {
        return Promise.resolve({ data: { count: 2 } });
      }
      if (url === "darasa/") {
        return Promise.resolve({ data: { count: 3 } });
      }
      if (url === "progress/") {
        return Promise.resolve({ data: { count: 4 } });
      }
      if (url === "users/") {
        return Promise.reject({ message: "Vous n'avez pas la permission d'accéder à cette ressource" });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    await expect(getDashboardStats()).resolves.toEqual({
      studentsCount: 2,
      sessionsCount: 3,
      progressCount: 4,
      teachersCount: 0,
    });
  });
});
