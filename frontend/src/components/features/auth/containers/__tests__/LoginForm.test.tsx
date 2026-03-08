import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/components/features/auth/containers/LoginForm';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('LoginForm', () => {
  it('toggles password visibility', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login,
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthOnMount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText('Enter password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    await userEvent.click(
      screen.getByRole('button', { name: 'Show password' }),
    );
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(
      screen.getByRole('button', { name: 'Hide password' }),
    );
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows validation errors on invalid submit', async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: vi.fn().mockResolvedValue(undefined),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthOnMount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

    expect(
      await screen.findByText('Enter a valid email address'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Password must be at least 8 characters'),
    ).toBeInTheDocument();
  });

  it('submits valid payload', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login,
      register: vi.fn(),
      logout: vi.fn(),
      checkAuthOnMount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await userEvent.type(
      screen.getByPlaceholderText('your@example.com'),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter password'),
      'Password1!',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password1!',
      });
    });
  });
});
