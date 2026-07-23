import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Box, ShoppingBag, Users, LineChart, FileText, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { name: 'Inventory', path: '/admin/inventory', icon: Box },
    { name: 'Purchases', path: '/admin/purchases', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-20"
    >
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">AutoStock Pro</span>
          </motion.div>
        )}
        
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-md">
              <Car className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3.5 top-7 bg-white border border-gray-100 shadow-sm rounded-full p-1 text-gray-400 hover:text-primary-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!isCollapsed && (
                <span className={`font-semibold text-sm transition-colors ${isActive ? 'text-primary-700' : ''}`}>
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-colors" />
          {!isCollapsed && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
