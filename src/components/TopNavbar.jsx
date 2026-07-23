import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
        isActive(to)
          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 flex h-20 items-center px-6 lg:px-12 transition-all">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mr-12 group">
        <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
          <Car className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
          AutoStock Pro
        </span>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 flex items-center gap-2">
        <NavLink to="/" label="Home" />
        <NavLink to="/inventory" label="Inventory" />
        {user && user.role === 'ADMIN' && (
          <NavLink to="/admin" label="Admin Dashboard" />
        )}
      </nav>

      {/* Auth / User Section */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link 
              to="/login" 
              className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
            >
              Register
            </Link>
          </>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 focus:outline-none bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200">
                <span className="text-primary-600 font-bold text-sm">
                  {(user.email || user.username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {(user.email || user.username || 'User').split('@')[0]}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-gray-100 mb-2 bg-gray-50/50">
                     <p className="text-sm font-bold text-gray-900 truncate">{(user.email || user.username || 'User').split('@')[0]}</p>
                     <p className="text-xs font-medium text-gray-500 truncate">{user.role}</p>
                  </div>
                  
                  {user.role !== 'ADMIN' && (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <User className="w-4 h-4" />
                        My Dashboard
                      </Link>
                    </>
                  )}
                  
                  <Link to="/settings" className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="h-px bg-gray-100 my-2"></div>
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
