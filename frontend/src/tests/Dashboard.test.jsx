import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard/Dashboard';
import api from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

vi.mock('../utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Dashboard Component', () => {
  const mockHistory = [
    {
      id: 1,
      quantity: 2,
      total_price: 50000,
      created_at: '2026-07-30T00:00:00Z',
      vehicle: { id: 1, make: 'Toyota', model: 'Camry', price: 25000, image_url: 'https://example.com/camry.jpg' }
    },
    {
      id: 2,
      quantity: 1,
      total_price: 22000,
      created_at: '2026-07-30T00:00:00Z',
      vehicle: { id: 2, make: 'Honda', model: 'Civic', price: 22000, image_url: 'https://example.com/civic.jpg' }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 1, role: 'USER', email: 'test@example.com' } });
  });

  it('renders loading spinner initially', () => {
    api.get.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders dashboard KPI stats and purchase history on API success', async () => {
    api.get.mockResolvedValueOnce({ data: mockHistory });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(/Welcome back, test!/i)).toBeInTheDocument();
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });
  });

  it('handles error state gracefully on API failure', async () => {
    api.get.mockRejectedValueOnce(new Error('Network Error'));
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(/You haven't made any purchases yet/i)).toBeInTheDocument();
    });
  });

  it('renders empty state when no purchases exist', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/You haven't made any purchases yet/i)).toBeInTheDocument();
    });
  });

  it('calls API to fetch user purchase history', async () => {
    api.get.mockResolvedValueOnce({ data: mockHistory });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/purchase/history');
    });
  });
});
