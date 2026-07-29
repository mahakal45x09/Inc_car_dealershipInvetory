import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      
      <div className="app-layout-body">
        <Sidebar />
        
        <div className="app-layout-content-wrapper">
          <main className="app-main-content">
            {/* The Outlet renders the nested route content (e.g. Dashboard, Vehicles) */}
            <Outlet />
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}
