import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react';

const revenueData = [
  { name: 'Jan', sales: 45000, rentals: 12000 },
  { name: 'Feb', sales: 52000, rentals: 15000 },
  { name: 'Mar', sales: 48000, rentals: 18000 },
  { name: 'Apr', sales: 61000, rentals: 22000 },
  { name: 'May', sales: 59000, rentals: 25000 },
  { name: 'Jun', sales: 75000, rentals: 28000 },
  { name: 'Jul', sales: 82000, rentals: 32000 },
];

const categoryData = [
  { name: 'Luxury Sedans', value: 45 },
  { name: 'SUVs', value: 30 },
  { name: 'Sports Cars', value: 15 },
  { name: 'Electric', value: 10 },
];

export default function Revenue() {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-1">Revenue Analytics</h1>
        <p className="text-gray-500">Comprehensive breakdown of sales and rental income.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-emerald-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue YTD</p>
              <h3 className="text-2xl font-bold text-secondary">$1,452,000</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicle Sales</p>
              <h3 className="text-2xl font-bold text-secondary">$1,200,000</h3>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rental Income</p>
              <h3 className="text-2xl font-bold text-secondary">$252,000</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income Stream Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-secondary mb-6">Income Stream</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" name="Sales" dataKey="sales" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" name="Rentals" dataKey="rentals" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRentals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-secondary mb-6">Performance by Category</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 13, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
