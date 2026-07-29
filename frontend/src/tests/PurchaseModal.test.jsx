import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PurchaseModal from '../components/PurchaseModal';
import api from '../utils/axios';
import toast from 'react-hot-toast';

vi.mock('../utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('PurchaseModal Component', () => {
  const mockVehicle = { id: 1, make: 'Toyota', model: 'Camry', price: 25000, quantity: 5 };
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with vehicle details', () => {
    render(<PurchaseModal vehicle={mockVehicle} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText(/Purchase Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/5 in stock/i)).toBeInTheDocument();
  });

  it('validates quantity limits', async () => {
    render(<PurchaseModal vehicle={mockVehicle} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/quantity/i);
    const purchaseBtn = screen.getByRole('button', { name: 'Confirm Purchase' });

    // Try to purchase 0
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(purchaseBtn);
    expect(await screen.findByText(/Quantity must be at least 1/i)).toBeInTheDocument();

    // Try to purchase more than stock
    fireEvent.change(input, { target: { value: '6' } });
    fireEvent.click(purchaseBtn);
    expect(await screen.findByText(/Cannot purchase more than 5/i)).toBeInTheDocument();
  });

  it('calls API and onSuccess callback on successful purchase', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'Purchase successful' } });
    
    render(<PurchaseModal vehicle={mockVehicle} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/quantity/i);
    fireEvent.change(input, { target: { value: '2' } });
    
    const purchaseBtn = screen.getByRole('button', { name: 'Confirm Purchase' });
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles/1/purchase', null, { params: { quantity: 2 } });
      expect(toast.success).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays error toast on API failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { detail: 'Insufficient stock' } }
    });
    
    render(<PurchaseModal vehicle={mockVehicle} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/quantity/i);
    fireEvent.change(input, { target: { value: '2' } });
    
    const purchaseBtn = screen.getByRole('button', { name: 'Confirm Purchase' });
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Insufficient stock');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
