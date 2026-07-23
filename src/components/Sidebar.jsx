import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiGrid, FiClock, FiLogOut, FiPieChart, FiSettings, FiList } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive(to)
          ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive(to) ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            CarDeal
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">
          Menu
        </div>
        
        {!user ? (
          <>
            <NavItem to="/" icon={FiHome} label="Home" />
            <NavItem to="/login" icon={FiLogOut} label="Login" />
            <NavItem to="/register" icon={FiSettings} label="Register" />
          </>
        ) : user.role === 'ADMIN' ? (
          <>
            <NavItem to="/admin" icon={FiPieChart} label="Overview" />
            <NavItem to="/admin/inventory" icon={FiList} label="Inventory" />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={FiGrid} label="Dashboard" />
            <NavItem to="/history" icon={FiClock} label="History" />
          </>
        )}
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gray-50 dark:bg-white/5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.email.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
