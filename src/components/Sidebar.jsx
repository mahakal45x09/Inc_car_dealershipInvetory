import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, LayoutDashboard, History, LogOut, PieChart, Settings, List, Car, Users, BarChart3, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen }) => {
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
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
        isActive(to)
          ? 'bg-orange-50 text-orange-500 font-semibold shadow-sm'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon 
        className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
          isActive(to) ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'
        }`} 
      />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Car className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          Motive
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-4">
          Main Menu
        </div>
        
        {!user ? (
          <>
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/login" icon={LogIn} label="Login" />
            <NavItem to="/register" icon={UserPlus} label="Register" />
          </>
        ) : user.role === 'ADMIN' ? (
          <>
            <NavItem to="/admin" icon={PieChart} label="Overview" />
            <NavItem to="/admin/inventory" icon={List} label="Inventory" />
            <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/admin/customers" icon={Users} label="Customers" />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/history" icon={History} label="Purchase History" />
          </>
        )}
      </nav>

      <div className="p-4 mt-auto">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 font-medium group"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Logout</span>
          </button>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-3">Upgrade to Premium</p>
            <Link to="/register" className="block w-full py-2 bg-orange-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-xl hover:bg-orange-600 transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
