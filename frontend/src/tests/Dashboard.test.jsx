import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
  const mockVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
    { id: 2, make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 1, role: 'USER' } });
  });

  it('renders loading spinner initially', () => {
    api.get.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner usually has role="status"
  });

  it('renders vehicle list on API success', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    api.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load vehicles/i)).toBeInTheDocument();
    });
  });

  it('renders empty state when no vehicles are found', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/no vehicles found/i)).toBeInTheDocument();
    });
  });

  it('calls API with search params when filter is applied', async () => {
    api.get.mockResolvedValueOnce({ data: mockVehicles });
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles', { params: {} });
    });

    api.get.mockResolvedValueOnce({ data: [mockVehicles[0]] });
    
    const makeInput = screen.getByPlaceholderText(/e.g. Toyota/i);
    fireEvent.change(makeInput, { target: { value: 'Toyota' } });
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/vehicles/search', {
        params: { make: 'Toyota', model: '', category: '', min_price: '', max_price: '' }
      });
    });
  });
});
