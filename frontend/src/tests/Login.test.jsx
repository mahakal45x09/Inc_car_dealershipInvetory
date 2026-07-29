import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../pages/Login/Login';
import api from '../utils/axios';

// Mock the API
vi.mock('../utils/axios', () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext if it exists, or assume AuthProvider wraps in index.jsx
// For isolated component testing, we might just mock the useAuth hook if used.
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates email input', async () => {
    renderWithProviders(<Login />);
    
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('validates password input', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('calls API on successful form submission', async () => {
    api.post.mockResolvedValueOnce({ data: { access_token: 'fake-token' } });
    
    renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', expect.any(Object));
    });
  });

  it('redirects on success', async () => {
    api.post.mockResolvedValueOnce({ data: { access_token: 'fake-token' } });
    
    renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on failed login', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { detail: 'Invalid credentials' } },
    });
    
    renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
