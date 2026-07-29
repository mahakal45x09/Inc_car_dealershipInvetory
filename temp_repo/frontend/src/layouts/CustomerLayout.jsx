import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Car, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerLayout() {
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle transparent navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy Cars', path: '/buy' },
    { name: 'Rent Cars', path: '/rent' },
    { name: 'Sell Car', path: '/sell' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      
      {/* Dynamic Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isScrolled ? 'bg-primary' : 'bg-white'}`}>
              <Car size={18} className={isScrolled ? 'text-white' : 'text-primary'} />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${isScrolled ? 'text-secondary' : 'text-white'}`}>
              AutoStock Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                className={({ isActive }) => `text-sm font-medium transition-colors ${
                  isActive 
                    ? (isScrolled ? 'text-primary' : 'text-white border-b-2 border-white') 
                    : (isScrolled ? 'text-gray-600 hover:text-primary' : 'text-gray-300 hover:text-white')
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/portal" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=f3f4f6&color=374151`} alt="Avatar" />
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isScrolled 
                    ? 'bg-secondary text-white hover:bg-gray-800' 
                    : 'bg-white text-secondary hover:bg-gray-100'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={isScrolled ? 'text-secondary' : 'text-white'} size={24} />
            ) : (
              <Menu className={isScrolled ? 'text-secondary' : 'text-white'} size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6"
          >
            <div className="flex flex-col gap-6 text-lg font-medium text-secondary">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'text-primary' : 'text-secondary'}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-px bg-gray-200 my-2 w-full"></div>
              {isAuthenticated ? (
                <Link to="/portal" className="flex items-center gap-3">
                  <User size={24} />
                  <span>My Profile</span>
                </Link>
              ) : (
                <Link to="/login" className="text-primary font-bold">Sign In to your Account</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full bg-background relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Car size={18} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">AutoStock Pro</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                The ultimate premium marketplace and dealership inventory management platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Marketplace</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/buy" className="hover:text-primary transition-colors">Browse Cars</Link></li>
                <li><Link to="/rent" className="hover:text-primary transition-colors">Rent a Car</Link></li>
                <li><Link to="/sell" className="hover:text-primary transition-colors">Sell Your Car</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} AutoStock Pro by Antigravity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
