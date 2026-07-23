import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-indigo-900/80 border-b border-indigo-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-indigo-400">🏎️</span> Car Dealership
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search vehicles..."
                className="block w-full pl-10 pr-3 py-2 border border-indigo-500/30 rounded-xl leading-5 bg-indigo-950/50 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-900/80 transition-all sm:text-sm"
              />
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="text-pink-200 hover:text-pink-100 px-3 py-2 rounded-md text-sm font-medium border border-pink-500/30 bg-pink-500/10 transition-colors"
                  >
                    Admin Menu
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-indigo-100 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
