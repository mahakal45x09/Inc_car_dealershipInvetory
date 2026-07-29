import React from 'react';
import { Search, Bell, MessageSquare, Sun, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search inventory, users, or transactions..." 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium text-gray-900 outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Action Icons */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Sun className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 border border-white"></span>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 border border-white"></span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <button className="flex items-center gap-3 pl-2 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none mb-1">
              {user?.username || user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-xs font-semibold text-primary-500 leading-none">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-primary-700 font-bold">
              {(user?.username || user?.email || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
