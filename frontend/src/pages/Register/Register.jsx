import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axios';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { FaChrome, FaGithub } from 'react-icons/fa';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      await api.post('/auth/register', data);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
        <img 
          src="/src/assets/images/cars/login-illustration.png" 
          alt="Premium luxury car" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Start your journey.</h2>
            <p className="text-gray-300 text-lg max-w-md">Join thousands of premium members discovering their perfect vehicle with AutoStock Pro.</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium">Join us to start browsing premium vehicles</p>
          </div>
          
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              {errorMsg}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5 relative group">
              <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  id="full_name" 
                  {...register('full_name', { required: 'Full Name is required' })} 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder-gray-400 font-medium" 
                  placeholder="John Doe"
                />
              </div>
              {errors.full_name && <p className="text-red-500 text-xs pl-1 font-medium">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1.5 relative group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder-gray-400 font-medium" 
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs pl-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5 relative group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })} 
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder-gray-400 font-medium" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs pl-1 font-medium">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="relative w-full py-4 px-4 text-center rounded-xl text-white font-bold shadow-lg shadow-orange-500/30 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 transition-all transform hover:-translate-y-0.5 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 group"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out"></div>
              <div className="relative flex items-center justify-center gap-2">
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </div>
            </button>
          </form>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors shadow-sm">
              <FaGithub className="w-5 h-5" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition-colors shadow-sm">
              <FaChrome className="w-5 h-5 text-red-500" /> Google
            </button>
          </div>
          
          <div className="text-center text-sm font-medium text-gray-500 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-500 transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
