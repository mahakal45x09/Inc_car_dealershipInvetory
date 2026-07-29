import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  CalendarCheck, 
  ShoppingCart, 
  BadgeDollarSign, 
  Settings, 
  LogOut,
  Map,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/inventory', icon: Car },
    { name: 'Rentals', path: '/admin/rentals', icon: CalendarCheck },
    { name: 'Purchases', path: '/admin/purchases', icon: ShoppingCart },
    { name: 'Tracking', path: '/admin/tracking', icon: Map },
    { name: 'Revenue', path: '/admin/revenue', icon: BadgeDollarSign },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-secondary">AutoStock</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu</div>
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-secondary'
                }`
              }
            >
              <item.icon size={20} strokeWidth={2} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <NavLink 
            to="/portal" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-secondary"
          >
            <LogOut size={20} strokeWidth={2} />
            <span>Portal Gateway</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="w-64">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-secondary transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-secondary">{user?.full_name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=f3f4f6&color=374151" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
