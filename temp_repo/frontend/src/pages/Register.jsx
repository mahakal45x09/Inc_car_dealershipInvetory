import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-inner">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h2>Create an Account</h2>
        <p>Join AutoStock Pro to manage your dealership</p>
      </div>

      {apiError && (
        <div className="alert-error" style={{ marginBottom: '1.5rem', color: 'var(--color-danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)' }}>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          name="full_name"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
          autoFocus
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        
        <div style={{ marginTop: '2rem' }}>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Sign Up
          </Button>
        </div>
      </form>

      <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Already have an account? </span>
        <Link to="/login" style={{ fontWeight: 500 }}>Sign in</Link>
      </div>
    </div>
  );
}
