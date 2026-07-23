import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const response = await api.post('/auth/register', {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      toast.success(response.data?.message || 'User registered successfully!');
      navigate('/login');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Registration failed. Please try again.';
      setErrorMsg(detail);
      toast.error(detail);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-10 space-y-6 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 text-white">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Register</h1>
          <p className="text-gray-300 text-sm">Create an account to get started</p>
        </div>
        
        {errorMsg && (
          <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-md">
            {errorMsg}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 text-sm">
            <label htmlFor="full_name" className="block font-medium text-gray-200">Full Name</label>
            <input 
              type="text" 
              id="full_name" 
              {...register('full_name', { required: 'Full Name is required' })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all text-white placeholder-white/30" 
              placeholder="John Doe"
            />
            {errors.full_name && <p className="text-red-300 text-xs pl-1">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2 text-sm">
            <label htmlFor="email" className="block font-medium text-gray-200">Email</label>
            <input 
              type="email" 
              id="email" 
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all text-white placeholder-white/30" 
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-300 text-xs pl-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 text-sm">
            <label htmlFor="password" className="block font-medium text-gray-200">Password</label>
            <input 
              type="password" 
              id="password" 
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all text-white placeholder-white/30" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-300 text-xs pl-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="block w-full py-3.5 px-4 text-center rounded-xl text-white bg-indigo-500 hover:bg-indigo-400 focus:ring-4 focus:ring-indigo-500/50 transition-all font-semibold shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
