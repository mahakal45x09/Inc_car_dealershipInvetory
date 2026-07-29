import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AuthLayout from './pages/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PortalSelection from './pages/PortalSelection';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import RentalRequests from './pages/admin/RentalRequests';
import PurchaseHistory from './pages/admin/PurchaseHistory';
import Tracking from './pages/admin/Tracking';
import Revenue from './pages/admin/Revenue';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import BuyCars from './pages/customer/BuyCars';
import RentCars from './pages/customer/RentCars';
import SellCar from './pages/customer/SellCar';

// Temporary Placeholders
function Placeholder({ title }) {
  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">{title}</h1>
        <p className="text-gray-500">This page is currently under construction for a future phase.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Customer Portal Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/buy" element={<BuyCars />} />
            <Route path="/rent" element={<RentCars />} />
            <Route path="/sell" element={<SellCar />} />
            <Route path="/profile" element={<Placeholder title="My Profile" />} />
          </Route>

          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Portal Gateway */}
          <Route 
            path="/portal" 
            element={
              <ProtectedRoute>
                <PortalSelection />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Portal Routes */}
          <Route 
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="rentals" element={<RentalRequests />} />
            <Route path="purchases" element={<PurchaseHistory />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
