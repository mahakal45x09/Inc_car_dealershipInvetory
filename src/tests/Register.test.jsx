import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import Register from '../pages/Register/Register';
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

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('validates required inputs', async () => {
    renderWithProviders(<Register />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('calls API and redirects on successful registration', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'User registered successfully' } });
    
    renderWithProviders(<Register />);
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays error message on duplicate email', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { detail: 'Email already registered' } },
    });
    
    renderWithProviders(<Register />);
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'duplicate@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email already registered/i)).toBeInTheDocument();
  });
});
