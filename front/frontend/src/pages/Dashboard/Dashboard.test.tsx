import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";

vi.mock("../../hooks/useDashboard", () => ({
  useDashboard: () => ({
    stats: {
      studentsCount: 12,
      sessionsCount: 5,
      progressCount: 8,
      teachersCount: 3,
    },
    loading: false,
    error: null,
  }),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the admin dashboard for administrators", () => {
    localStorage.setItem("current_user", JSON.stringify({ username: "admin", role: "ADMIN" }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Tableau de bord administrateur/i)).toBeInTheDocument();
    expect(screen.getByText(/Étudiants/i)).toBeInTheDocument();
  });

  it("shows the user dashboard for teachers", () => {
    localStorage.setItem("current_user", JSON.stringify({ username: "teacher", role: "TEACHER" }));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Espace utilisateur/i)).toBeInTheDocument();
    expect(screen.getByText(/Vue synthétique de votre activité/i)).toBeInTheDocument();
  });
});
