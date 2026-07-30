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
    
    expect(screen.getByPlaceholderText(/e.g. BMW/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. M4/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Max/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onSearch with applied filters', async () => {
    render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. BMW/i), { target: { name: 'make', value: 'Toyota' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({
        make: 'Toyota'
      }));
    });
  });

  it('calls onReset and clears inputs when reset button is clicked', async () => {
    render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const makeInput = screen.getByPlaceholderText(/e.g. BMW/i);
    fireEvent.change(makeInput, { target: { name: 'make', value: 'Toyota' } });
    expect(makeInput.value).toBe('Toyota');
    
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(mockOnReset).toHaveBeenCalled();
    expect(makeInput.value).toBe('');
  });
});
