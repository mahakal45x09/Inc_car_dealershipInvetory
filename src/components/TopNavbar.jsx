import React, { useState } from 'react';
import { Search, Bell, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 flex h-16 items-center gap-4 px-4 sm:px-6">
      <button 
        onClick={toggleSidebar} 
        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 bg-gray-100/50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500/50 transition-all placeholder-gray-400"
            placeholder="Search vehicles, users, or settings..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            {user ? (
              <>
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                  <span className="text-orange-600 font-bold text-sm">
                    {(user.email || user.username || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">
                    {(user.email || user.username || 'User').split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </>
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </button>

          <AnimatePresence>
            {showDropdown && user && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
              >
                <div className="px-4 py-2 border-b border-gray-100 mb-2 md:hidden">
                   <p className="text-sm font-semibold text-gray-900 truncate">{(user.email || user.username || 'User').split('@')[0]}</p>
                   <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
                <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </a>
                <button 
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
