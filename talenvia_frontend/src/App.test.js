import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./state/auth/AuthContext";

function renderWithProviders(initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

test("renders login page on /login route", async () => {
  renderWithProviders(["/login"]);
  expect(screen.getByText(/Welcome to Talenvia/i)).toBeInTheDocument();
});

test("renders dashboard for authenticated users in mock auth mode", async () => {
  // In mock auth mode (no Supabase configured), auth provider considers user signed in.
  renderWithProviders(["/dashboard"]);
  expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
});
