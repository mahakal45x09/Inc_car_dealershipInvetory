import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageVehicles from '../pages/Admin/ManageVehicles';
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

describe('Admin Dashboard Components', () => {
  const mockVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5, image_url: '' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 2, role: 'ADMIN' } });
    api.get.mockResolvedValue({ data: mockVehicles });
  });

  describe('AdminDashboard Metrics View', () => {
    it('renders KPI analytics cards and charts', async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
        expect(screen.getByText('Available Vehicles')).toBeInTheDocument();
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
      });
    });
  });

  describe('ManageVehicles Inventory CRUD View', () => {
    it('renders inventory table correctly', async () => {
      render(<ManageVehicles />);
      
      await waitFor(() => {
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
        expect(screen.getByText('Sedan')).toBeInTheDocument();
        expect(screen.getByText('$25,000')).toBeInTheDocument();
      });
    });

    it('opens add vehicle modal when Add Vehicle is clicked', async () => {
      render(<ManageVehicles />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));
      
      expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    });

    it('calls API and adds vehicle to table', async () => {
      render(<ManageVehicles />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

      const makeInput = screen.getByLabelText(/make/i);
      const form = makeInput.closest('form');

      fireEvent.change(makeInput, { target: { value: 'Honda' } });
      fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Civic' } });
      fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'SUV' } });
      fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '22000' } });
      fireEvent.change(screen.getByLabelText(/stock qty|quantity/i), { target: { value: '10' } });

      api.post.mockResolvedValueOnce({ data: { id: 2, make: 'Honda', model: 'Civic', category: 'SUV', price: 22000, quantity: 10 } });
      
      await waitFor(() => {
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/vehicles', expect.objectContaining({
          make: 'Honda',
          model: 'Civic',
          category: 'SUV',
          price: 22000,
          quantity: 10
        }));
        expect(toast.success).toHaveBeenCalledWith('Vehicle added successfully');
      });
    });

    it('calls API on delete', async () => {
      render(<ManageVehicles />);
      
      await waitFor(() => {
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      });

      window.confirm = vi.fn().mockReturnValue(true);
      api.delete.mockResolvedValueOnce({});
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(api.delete).toHaveBeenCalledWith('/vehicles/1');
        expect(toast.success).toHaveBeenCalledWith('Vehicle deleted successfully');
      });
    });
  });
});
