import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SearchFilter from '../components/SearchFilter';

describe('SearchFilter Component', () => {
  const mockOnSearch = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter inputs', () => {
    render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    expect(screen.getByPlaceholderText(/e.g. Toyota/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Camry/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Sedan/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Max/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onSearch with applied filters', async () => {
    render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. Toyota/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText(/Min/i), { target: { value: '10000' } });
    
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        make: 'Toyota',
        model: '',
        category: '',
        min_price: '10000',
        max_price: '',
      });
    });
  });

  it('calls onReset and clears inputs when reset button is clicked', async () => {
    render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const makeInput = screen.getByPlaceholderText(/e.g. Toyota/i);
    fireEvent.change(makeInput, { target: { value: 'Toyota' } });
    expect(makeInput.value).toBe('Toyota');
    
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(mockOnReset).toHaveBeenCalled();
    expect(makeInput.value).toBe('');
  });
});
