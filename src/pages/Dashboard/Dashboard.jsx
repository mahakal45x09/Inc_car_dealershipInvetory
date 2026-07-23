import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import VehicleCard from '../../components/VehicleCard';
import { motion } from 'framer-motion';
import { Car, DollarSign, TrendingUp, Package } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_vehicles: 0, total_value: 0 });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, vehiclesRes] = await Promise.all([
        api.get('/vehicles/stats'),
        api.get('/vehicles', { params: { limit: 6 } })
      ]);
      setStats(statsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  // Dummy chart data for KPI cards
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const kpiCards = [
    {
      title: "Total Vehicles",
      value: stats.total_vehicles,
      icon: <Car className="w-8 h-8 text-orange-500" />,
      gradient: "from-orange-500/10 to-transparent",
      color: "#f97316",
      trend: "+12%"
    },
    {
      title: "Available Stock",
      value: stats.total_vehicles > 0 ? stats.total_vehicles - 2 : 0, // Mock
      icon: <Package className="w-8 h-8 text-blue-500" />,
      gradient: "from-blue-500/10 to-transparent",
      color: "#3b82f6",
      trend: "+5%"
    },
    {
      title: "Sold Cars",
      value: "2", // Mock
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      gradient: "from-green-500/10 to-transparent",
      color: "#22c55e",
      trend: "+18%"
    },
    {
      title: "Total Revenue",
      value: `$${(stats.total_value || 0).toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8 text-purple-500" />,
      gradient: "from-purple-500/10 to-transparent",
      color: "#a855f7",
      trend: "+24%"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {(user?.email || user?.username || 'User').split('@')[0]}!</h1>
          <p className="text-gray-500 font-medium">Here's what's happening with your dealership today.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`bg-gradient-to-br ${card.gradient} bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative`}
          >
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white border border-gray-100 shadow-sm`} style={{ color: card.color }}>
                {card.trend}
              </span>
            </div>
            
            <div className="relative z-10 space-y-1 mb-6">
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{card.value}</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={card.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={card.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ display: 'none' }} />
                  <Area type="monotone" dataKey="value" stroke={card.color} strokeWidth={2} fillOpacity={1} fill={`url(#color${index})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Vehicles */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Additions</h2>
            <p className="text-sm text-gray-500 font-medium">Latest vehicles added to inventory</p>
          </div>
          <a href="/inventory" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
            View All
          </a>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white h-96 rounded-[2rem] shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-100 rounded-t-[2rem]"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                  <div className="h-10 bg-gray-100 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No vehicles in inventory yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
