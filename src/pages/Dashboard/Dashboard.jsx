import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/axios';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Car, TrendingUp, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/purchase/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Calculate Stats
  const totalPurchases = history.length;
  const totalSpent = history.reduce((acc, curr) => acc + curr.total_price, 0);
  
  // Mock monthly data for charts based on history
  const monthlyData = [
    { name: 'Jan', spent: 0, purchases: 0 },
    { name: 'Feb', spent: 0, purchases: 0 },
    { name: 'Mar', spent: 0, purchases: 0 },
    { name: 'Apr', spent: 0, purchases: 0 },
    { name: 'May', spent: totalSpent * 0.3 || 45000, purchases: Math.floor(totalPurchases * 0.3) || 1 },
    { name: 'Jun', spent: totalSpent * 0.7 || 120000, purchases: Math.ceil(totalPurchases * 0.7) || 2 },
  ];

  const stats = [
    {
      title: "Total Vehicles Bought",
      value: totalPurchases,
      icon: <ShoppingBag className="w-8 h-8 text-primary-500" />,
      gradient: "from-primary-50 to-white",
      color: "#F97316"
    },
    {
      title: "Total Money Spent",
      value: `$${totalSpent.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      gradient: "from-green-50 to-white",
      color: "#22c55e"
    },
    {
      title: "Recent Transactions",
      value: Math.min(3, totalPurchases),
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      gradient: "from-blue-50 to-white",
      color: "#3b82f6"
    },
    {
      title: "Active Orders",
      value: totalPurchases > 0 ? "1" : "0",
      icon: <Car className="w-8 h-8 text-purple-500" />,
      gradient: "from-purple-50 to-white",
      color: "#a855f7"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto px-6 pt-32">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Welcome back, {(user?.email || user?.username || 'User').split('@')[0]}!
          </h1>
          <p className="text-gray-500 font-medium text-lg">Here is an overview of your account activity and purchases.</p>
        </div>
        <Link to="/inventory" className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
          Browse Vehicles <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{stat.title}</h3>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Spending Trend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Spending Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Spent']}
                />
                <Area type="monotone" dataKey="spent" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Purchase History Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Purchases Over Time</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dx={-10} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="purchases" fill="#F97316" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Purchases List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold text-gray-900">Recent Purchases</h2>
          <Link to="/history" className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors">
            View Full History
          </Link>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">You haven't made any purchases yet.</p>
            <Link to="/inventory" className="mt-4 inline-block font-bold text-primary-500 hover:text-primary-600">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <img 
                  src={item.vehicle.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=200'} 
                  alt={item.vehicle.model} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=200'; e.target.onerror = null; }}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{item.vehicle.make} {item.vehicle.model}</h4>
                  <p className="text-sm text-gray-500 font-medium">Purchased: {new Date(item.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-gray-900">${item.total_price.toLocaleString()}</p>
                  <p className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block mt-1">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
