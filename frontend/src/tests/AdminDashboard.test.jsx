import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

vi.mock('../utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AdminDashboard Component', () => {
  const mockVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 2, role: 'ADMIN' } });
    api.get.mockResolvedValue({ data: mockVehicles });
  });

  it('renders inventory table', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Toyota')).toBeInTheDocument();
      expect(screen.getByText('Camry')).toBeInTheDocument();
      expect(screen.getByText('Sedan')).toBeInTheDocument();
      expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    });
  });

  it('opens add vehicle modal when Add Vehicle is clicked', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));
    
    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
  });

  it('calls API and refreshes table on successful add', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Civic' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Sedan' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '22000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '10' } });

    api.post.mockResolvedValueOnce({ data: { id: 2, make: 'Honda' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save vehicle/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles', {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 10,
        description: '',
        image_url: ''
      });
      expect(toast.success).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
  });

  it('calls API on delete', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    window.confirm = vi.fn().mockReturnValue(true); // Mock window.confirm

    api.delete.mockResolvedValueOnce({});
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith('/vehicles/1');
      expect(toast.success).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
  });
});
