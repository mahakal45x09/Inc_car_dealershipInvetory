import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Invalid credentials';
      setErrorMsg(detail);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md p-10 space-y-6 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 text-white">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Login</h1>
          <p className="text-gray-300 text-sm">Sign in to your account to continue</p>
        </div>
        
        {errorMsg && (
          <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-md">
            {errorMsg}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 text-sm">
            <label htmlFor="email" className="block font-medium text-gray-200">Email</label>
            <input 
              type="email" 
              id="email" 
              {...register('email', { required: 'Email is required' })} 
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
              {...register('password', { required: 'Password is required' })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all text-white placeholder-white/30" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-300 text-xs pl-1">{errors.password.message}</p>}
          </div>
          <button type="submit" className="block w-full py-3.5 px-4 text-center rounded-xl text-white bg-indigo-500 hover:bg-indigo-400 focus:ring-4 focus:ring-indigo-500/50 transition-all font-semibold shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transform hover:-translate-y-0.5">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
