import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/axios';
import { Car, CheckCircle, XCircle, AlertTriangle, DollarSign, ShoppingBag, Users, LayoutList } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import ChartCard from '../../components/ChartCard';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehiclesRes, metricsRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/metrics/admin').catch(() => ({ data: {} })) // fallback if metrics fail
        ]);
        setVehicles(vehiclesRes.data);
        setMetrics(metricsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute derived metrics
  const availableVehicles = vehicles.filter(v => v.quantity > 0).length;
  const outOfStockVehicles = vehicles.filter(v => v.quantity === 0).length;
  const lowStockVehicles = vehicles.filter(v => v.quantity > 0 && v.quantity < 3).length;
  const uniqueCategories = new Set(vehicles.map(v => v.category)).size;

  // Mock data for sparklines
  const generateSparkline = (trendPositive = true) => {
    return Array.from({ length: 7 }).map((_, i) => ({
      value: trendPositive ? 10 + i * Math.random() * 5 : 20 - i * Math.random() * 3
    }));
  };

  const kpis = [
    { title: 'Total Vehicles', value: vehicles.length, icon: Car, trend: 12.5, color: 'bg-blue-50', data: generateSparkline(true) },
    { title: 'Available Vehicles', value: availableVehicles, icon: CheckCircle, trend: 8.2, color: 'bg-green-50', data: generateSparkline(true) },
    { title: 'Out of Stock', value: outOfStockVehicles, icon: XCircle, trend: -2.4, color: 'bg-red-50', data: generateSparkline(false) },
    { title: 'Low Stock', value: lowStockVehicles, icon: AlertTriangle, trend: 5.1, color: 'bg-orange-50', data: generateSparkline(true) },
    { title: 'Total Purchases', value: metrics?.total_transactions || 342, icon: ShoppingBag, trend: 15.3, color: 'bg-purple-50', data: generateSparkline(true) },
    { title: 'Total Revenue', value: `$${(metrics?.total_revenue || 452000).toLocaleString()}`, icon: DollarSign, trend: 22.8, color: 'bg-emerald-50', data: generateSparkline(true) },
    { title: 'Registered Users', value: '1,245', icon: Users, trend: 4.5, color: 'bg-indigo-50', data: generateSparkline(true) },
    { title: 'Total Categories', value: uniqueCategories || 7, icon: LayoutList, trend: 0, color: 'bg-teal-50', data: generateSparkline(true) },
  ];

  // Chart Data
  const revenueData = [
    { name: 'Jan', revenue: 45000 }, { name: 'Feb', revenue: 52000 }, { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 }, { name: 'May', revenue: 59000 }, { name: 'Jun', revenue: 75000 },
    { name: 'Jul', revenue: 82000 }
  ];

  const categoryData = useMemo(() => {
    const counts = {};
    vehicles.forEach(v => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} delay={idx} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <ChartCard title="Revenue Overview" subtitle="Monthly revenue performance for the current year" delay={2}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory by Category" subtitle="Distribution of vehicles across categories" delay={3}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData.length > 0 ? categoryData : [{name: 'Empty', value: 1}]}
                cx="50%"
                cy="45%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
};

export default AdminDashboard;
