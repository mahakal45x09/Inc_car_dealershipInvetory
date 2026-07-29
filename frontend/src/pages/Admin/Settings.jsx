import React, { useState } from 'react';
import { User, Lock, Save, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || user?.email?.split('@')[0] || 'Admin',
    email: user?.email || 'admin@dealership.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Admin settings updated successfully!');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your account preferences and security.</p>
        </div>
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
          <Shield className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Profile Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" /> Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Display Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-gray-900" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Security Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-500" /> Security
            </h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Current Password</label>
                <input 
                  type="password" 
                  value={formData.currentPassword}
                  onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-gray-900" 
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">New Password</label>
                <input 
                  type="password" 
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-gray-900" 
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Confirm New Password</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-gray-900" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5">
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;
