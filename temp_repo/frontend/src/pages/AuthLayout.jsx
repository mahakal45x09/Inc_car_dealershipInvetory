import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthLayout.css';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // If loading auth state, you might want to show a spinner here
  if (isLoading) return null;

  // Redirect authenticated users to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout">
      {/* Decorative side */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1>AutoStock Pro</h1>
          <p>The ultimate dealership inventory and customer management platform.</p>
        </div>
      </div>
      
      {/* Form side */}
      <div className="auth-container">
        <div className="auth-form-wrapper glass-panel">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
