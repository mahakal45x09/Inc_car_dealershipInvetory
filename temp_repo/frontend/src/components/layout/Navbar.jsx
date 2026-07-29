import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar glass-panel">
      <div className="navbar-brand">
        <h2>AutoStock Pro</h2>
      </div>
      
      <div className="navbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span className="user-name">{user?.full_name || 'User'}</span>
        </div>
        
        <button className="logout-btn" onClick={logout} aria-label="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
