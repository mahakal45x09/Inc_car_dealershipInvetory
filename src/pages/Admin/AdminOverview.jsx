import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';

const AdminOverview = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Jan', revenue: 200 },
    { name: 'Feb', revenue: 300 },
    { name: 'Mar', revenue: 250 },
    { name: 'Apr', revenue: 450 },
    { name: 'May', revenue: 350 },
    { name: 'Jun', revenue: 1319 },
    { name: 'Jul', revenue: 900 },
    { name: 'Aug', revenue: 1200 },
    { name: 'Sep', revenue: 1100 },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/metrics/admin');
        setMetrics(response.data);
      } catch (err) {
        toast.error('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10 pb-4">
        <div className="relative w-96">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-900 transition-colors">
            <FiSettings className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-900 transition-colors">
            <FiBell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm cursor-pointer border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              A
            </div>
            <span className="font-semibold text-gray-700 text-sm">Admin</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Overview</h2>
        <p className="mt-2 text-gray-500 text-lg">Monitor key metrics and system performance from a unified dashboard</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Charts) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Chart */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative">
            <div className="flex items-center gap-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900">Transaction Activity</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                <span className="text-sm text-gray-500 font-medium">Total Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-500 font-medium">Success Transaction</span>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ef4444" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{r: 8, strokeWidth: 4, stroke: '#fff'}}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue</h3>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-green-400"></span>
                    <span className="text-sm text-gray-500 font-medium">Available</span>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">${metrics?.total_revenue?.toLocaleString() || '930,56'}</p>
                </div>
                <div className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg text-sm mb-1">
                  +7.5%
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Customer</h3>
                <span className="text-sm font-medium text-red-500 cursor-pointer">View more</span>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center p-3 rounded-xl bg-red-50/50">
                  <span className="font-semibold text-gray-900 text-sm">1. {metrics?.total_transactions || '100'} transaction</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">James Wishers</span>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Top</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-gray-900">Stock Available</h3>
              <span className="text-sm font-medium text-red-500 cursor-pointer">View more</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total product</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-6">{metrics?.total_vehicles || '124'}</p>
            
            <div className="flex items-center justify-between mb-8 text-sm font-medium">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-green-400"></span><span className="text-gray-500">Available</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-yellow-400"></span><span className="text-gray-500">Low stock</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-red-500"></span><span className="text-gray-500">Out of stock</span></div>
            </div>

            <div className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src="/images/car1.jpg" className="rounded object-cover w-12 h-8" alt="car" />
                    <span className="font-semibold text-gray-900 text-sm">Mercedes Benz</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${i % 2 === 0 ? 'bg-yellow-400' : 'bg-green-400'}`}>
                    {i % 2 === 0 ? 'Low Stock' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminOverview;
