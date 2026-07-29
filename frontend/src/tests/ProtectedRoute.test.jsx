import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;
const DashboardComponent = () => <div>Dashboard Page</div>;

describe('Route Protection Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProtectedRoute', () => {
    it('redirects to /login if user is not authenticated', () => {
      useAuth.mockReturnValue({ user: null });
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/protected" element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            } />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children if user is authenticated', () => {
      useAuth.mockReturnValue({ user: { id: 1, role: 'USER' } });
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/protected" element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            } />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('redirects to /login if user is not authenticated', () => {
      useAuth.mockReturnValue({ user: null });
      render(
        <MemoryRouter initialEntries={['/admin-only']}>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/admin-only" element={
              <AdminRoute>
                <TestComponent />
              </AdminRoute>
            } />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects to /dashboard if user is authenticated but not ADMIN', () => {
      useAuth.mockReturnValue({ user: { id: 1, role: 'USER' } });
      render(
        <MemoryRouter initialEntries={['/admin-only']}>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/admin-only" element={
              <AdminRoute>
                <TestComponent />
              </AdminRoute>
            } />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children if user is authenticated and is ADMIN', () => {
      useAuth.mockReturnValue({ user: { id: 2, role: 'ADMIN' } });
      render(
        <MemoryRouter initialEntries={['/admin-only']}>
          <Routes>
            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/admin-only" element={
              <AdminRoute>
                <TestComponent />
              </AdminRoute>
            } />
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
