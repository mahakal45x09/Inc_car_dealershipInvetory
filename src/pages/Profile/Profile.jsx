import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, Camera, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.username || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mocking an API call since backend doesn't support profile updates yet
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setIsSubmitting(true);
    // Mocking API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success("Password changed successfully!");
    }, 1000);
  };

  return (
    <div className="pb-24 w-full max-w-4xl mx-auto px-6 pt-32 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your profile information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center flex flex-col items-center"
          >
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                <span className="text-5xl font-bold text-primary-600">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute inset-0 bg-gray-900/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
            <p className="text-sm font-medium text-gray-500 mb-4">{user?.role === 'ADMIN' ? 'Administrator' : 'Customer Member'}</p>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">
              <Shield className="w-3 h-3" /> Account Verified
            </div>
          </motion.div>
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Personal Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-primary-500 w-5 h-5" /> Personal Information
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-1.5 group">
                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Security */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="text-primary-500 w-5 h-5" /> Security & Password
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-1.5 group">
                <label className="block text-sm font-bold text-gray-700">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-bold text-gray-700">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <label className="block text-sm font-bold text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.currentPassword || !formData.newPassword}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                >
                  <Lock className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
