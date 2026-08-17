import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

describe('Login page', () => {
  it('renders login form and submits', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nom utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Nom utilisateur/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
    expect(screen.getByRole('button', { name: /Connexion...|Se connecter/i })).toBeDisabled();
  });
});
