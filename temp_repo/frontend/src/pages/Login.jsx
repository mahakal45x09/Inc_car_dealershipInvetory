import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
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
      await login(email, password);
      navigate('/portal');
    } catch (err) {
      setApiError(err.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-inner">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your account</p>
      </div>

      {apiError && (
        <div className="alert-error" style={{ marginBottom: '1.5rem', color: 'var(--color-danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)' }}>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoFocus
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        
        <div style={{ marginTop: '2rem' }}>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Sign In
          </Button>
        </div>
      </form>

      <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Don't have an account? </span>
        <Link to="/register" style={{ fontWeight: 500 }}>Sign up</Link>
      </div>
    </div>
  );
}
