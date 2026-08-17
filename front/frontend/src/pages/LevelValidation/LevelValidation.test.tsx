import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import LevelValidation from "./LevelValidation";

vi.mock("../../hooks/useLevelValidations", () => ({
  useLevelValidations: () => ({
    validations: [
      {
        id: 1,
        student: { full_name: "Amadou Diop" },
        level: { name: "Niveau 1" },
        status: "PENDING",
        score: 62,
        notes: "À finaliser",
      },
    ],
    loading: false,
    error: null,
    updateStatus: vi.fn(),
  }),
}));

describe("LevelValidation", () => {
  it("renders the level validation page with student entries", () => {
    render(
      <MemoryRouter>
        <LevelValidation />
      </MemoryRouter>
    );

    expect(screen.getByText(/Validation des niveaux/i)).toBeInTheDocument();
    expect(screen.getByText(/Amadou Diop/i)).toBeInTheDocument();
    expect(screen.getAllByText(/En attente/i).length).toBeGreaterThan(0);
  });
});
