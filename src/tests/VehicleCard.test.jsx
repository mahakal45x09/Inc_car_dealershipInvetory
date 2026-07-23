import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import VehicleCard from '../components/VehicleCard';

describe('VehicleCard Component', () => {
  const mockVehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
    image_url: 'https://example.com/camry.jpg',
  };

  const mockOnPurchase = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders vehicle details correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} onPurchase={mockOnPurchase} />);
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
    
    const img = screen.getByRole('img', { name: /toyota camry/i });
    expect(img).toHaveAttribute('src', mockVehicle.image_url);
  });

  it('purchase button is enabled when quantity > 0', () => {
    render(<VehicleCard vehicle={mockVehicle} onPurchase={mockOnPurchase} />);
    
    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).not.toBeDisabled();
    
    fireEvent.click(purchaseBtn);
    expect(mockOnPurchase).toHaveBeenCalledWith(mockVehicle);
  });

  it('purchase button is disabled and shows Out of Stock when quantity is 0', () => {
    const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={mockOnPurchase} />);
    
    const purchaseBtn = screen.getByRole('button', { name: /out of stock/i });
    expect(purchaseBtn).toBeDisabled();
    
    fireEvent.click(purchaseBtn);
    expect(mockOnPurchase).not.toHaveBeenCalled();
  });

  it('renders a placeholder image when image_url is missing', () => {
    const noImageVehicle = { ...mockVehicle, image_url: null };
    render(<VehicleCard vehicle={noImageVehicle} onPurchase={mockOnPurchase} />);
    
    const img = screen.getByRole('img', { name: /toyota camry/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });
});
