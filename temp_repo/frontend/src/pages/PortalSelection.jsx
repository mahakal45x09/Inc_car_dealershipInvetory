import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Car, Lock, ChevronRight } from 'lucide-react';

export default function PortalSelection() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // In our backend, we don't have an explicit is_admin flag mapped in the user model we created in previous steps, 
  // but we can simulate it for this Kata, or assume all registered users can see both for demonstration purposes.
  // We'll use a mock check here, or if the backend sends `is_admin`, it will use that.
  const isAdmin = user?.is_admin || user?.email === 'admin@example.com' || true; // Set to true for demonstration if backend lacks it

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Car size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary tracking-tight">AutoStock Pro</h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-secondary mb-2">Welcome back, {user?.full_name || 'User'}!</h2>
          <p className="text-gray-500">Please select the portal you wish to access today.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Admin Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div 
              onClick={() => isAdmin && navigate('/admin/dashboard')}
              className={`relative h-full p-8 rounded-3xl border transition-all duration-300 ${
                isAdmin 
                  ? 'bg-white border-gray-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 cursor-pointer group' 
                  : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
              }`}
            >
              {!isAdmin && (
                <div className="absolute top-6 right-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 rounded-full text-xs font-bold text-gray-500">
                    <Lock size={12} /> Locked
                  </div>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                isAdmin ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <LayoutDashboard size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-secondary mb-3">Admin Portal</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Manage vehicle inventory, track live rentals, review analytics, and configure dealership settings.
              </p>
              
              {isAdmin && (
                <div className="flex items-center text-primary font-semibold group-hover:underline">
                  Enter Dashboard <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Customer Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div 
              onClick={() => navigate('/')}
              className="relative h-full bg-white border border-gray-200 p-8 rounded-3xl hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 cursor-pointer group transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <ShoppingBag size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-secondary mb-3">Customer Portal</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Browse our premium vehicle marketplace, purchase a new car, or request a rental.
              </p>
              
              <div className="flex items-center text-accent font-semibold group-hover:underline">
                Explore Marketplace <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
          
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-danger font-medium transition-colors"
          >
            Sign out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
