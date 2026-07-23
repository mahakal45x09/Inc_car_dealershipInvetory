import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import AdminLayout from '../layouts/AdminLayout';

import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageVehicles from '../pages/Admin/ManageVehicles';
import Purchases from '../pages/Admin/Purchases';
import Users from '../pages/Admin/Users';
import Reports from '../pages/Admin/Reports';
import Settings from '../pages/Admin/Settings';

import Dashboard from '../pages/Dashboard/Dashboard';
import PurchaseHistory from '../pages/Dashboard/PurchaseHistory';

import Home from '../pages/Home/Home';
import Inventory from '../pages/Inventory/Inventory';
import VehicleDetails from '../pages/VehicleDetails/VehicleDetails';
import Profile from '../pages/Profile/Profile';

const NotFound = () => <div className="p-4 flex items-center justify-center min-h-[60vh] text-2xl font-bold text-gray-500">404 Not Found</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <PurchaseHistory />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      {/* Admin Routes */}
      <Route element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/vehicles" element={<ManageVehicles />} />
        <Route path="/admin/inventory" element={<ManageVehicles />} />
        <Route path="/admin/purchases" element={<Purchases />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
