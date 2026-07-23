import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminOverview from '../pages/Admin/AdminOverview';
import Dashboard from '../pages/Dashboard/Dashboard';
import PurchaseHistory from '../pages/Dashboard/PurchaseHistory';

// Using placeholders for pages until they are implemented
const Home = () => <div className="p-4">Home Page (Under Construction)</div>;
const NotFound = () => <div className="p-4">404 Not Found</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
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
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
        } />
        <Route path="/admin/inventory" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
