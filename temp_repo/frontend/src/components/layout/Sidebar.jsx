import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Car, CalendarCheck, Users, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
  ];

  if (user?.is_admin) {
    navItems.push({ name: 'Users', path: '/users', icon: Users });
    navItems.push({ name: 'Settings', path: '/settings', icon: Settings });
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {navItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} className="sidebar-icon" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-help">
          <p>Need help?</p>
          <a href="#">View Documentation</a>
        </div>
      </div>
    </aside>
  );
}
