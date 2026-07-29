import React from 'react';
import { Save, Building2, Bell, ShieldCheck, Mail, CreditCard } from 'lucide-react';

export default function Settings() {
  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-1">Platform Settings</h1>
        <p className="text-gray-500">Manage global dealership configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Settings Navigation (Static visual only) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { icon: Building2, label: 'Dealership Profile', active: true },
            { icon: CreditCard, label: 'Payment Gateway', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Mail, label: 'Email Templates', active: false },
            { icon: ShieldCheck, label: 'Security', active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              item.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-secondary">Dealership Profile</h3>
              <p className="text-sm text-gray-500 mt-1">Update your company information and regional settings.</p>
            </div>
            
            <div className="p-6 space-y-8">
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">General Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Dealership Name</label>
                    <input type="text" defaultValue="AutoStock Pro" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Support Email</label>
                    <input type="email" defaultValue="support@autostockpro.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary mb-1">Address</label>
                    <input type="text" defaultValue="123 Luxury Lane, Beverly Hills, CA 90210" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Financial Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Currency</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Default Tax Rate (%)</label>
                    <input type="number" defaultValue="8.5" step="0.1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Marketplace Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Max Listings per Customer</label>
                    <input type="number" defaultValue="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Max Image Upload Size (MB)</label>
                    <input type="number" defaultValue="10" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
