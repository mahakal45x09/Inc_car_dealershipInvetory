import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Package, Users, DollarSign, Activity, Car } from 'lucide-react';

const data = [
  { name: 'Jan', total: 120, success: 80 },
  { name: 'Feb', total: 200, success: 150 },
  { name: 'Mar', total: 150, success: 110 },
  { name: 'Apr', total: 300, success: 220 },
  { name: 'May', total: 400, success: 380 },
  { name: 'Jun', total: 500, success: 420 },
  { name: 'Jul', total: 450, success: 400 },
  { name: 'Aug', total: 600, success: 550 },
  { name: 'Sep', total: 550, success: 500 },
  { name: 'Oct', total: 800, success: 750 },
  { name: 'Nov', total: 950, success: 900 },
  { name: 'Dec', total: 1319, success: 1250 },
];

const stockData = [
  { name: 'Available', value: 80, color: '#22C55E' },
  { name: 'Low Stock', value: 30, color: '#F59E0B' },
  { name: 'Out of Stock', value: 14, color: '#EF4444' },
];

const topSelling = 6780;

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-1">Overview</h1>
        <p className="text-gray-500">Monitor key metrics and system performance from a unified dashboard</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$930,560', change: '+12.5%', isUp: true, icon: DollarSign, color: 'bg-blue-50 text-primary' },
          { label: 'Active Rentals', value: '1,204', change: '+5.2%', isUp: true, icon: Activity, color: 'bg-green-50 text-success' },
          { label: 'Total Customers', value: '4,593', change: '+1.1%', isUp: true, icon: Users, color: 'bg-purple-50 text-purple-600' },
          { label: 'Vehicles in Stock', value: '384', change: '-2.4%', isUp: false, icon: Package, color: 'bg-orange-50 text-warning' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-secondary mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.isUp ? 'text-success' : 'text-danger'}`}>
                {stat.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {stat.change}
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-secondary">Transaction Activity</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200"></span><span className="text-gray-500">Total Transaction</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary"></span><span className="text-gray-500">Success Transaction</span></div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="total" stroke="#E5E7EB" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="success" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          
          {/* Stock Available */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-secondary">Stock Available</h3>
              <a href="#" className="text-sm text-primary font-medium hover:underline">View more</a>
            </div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-gray-500">Total product</p>
                <h2 className="text-3xl font-bold text-secondary">124</h2>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stockData} innerRadius={20} outerRadius={30} paddingAngle={2} dataKey="value">
                      {stockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <Car size={20} className="text-gray-400" />
                  </div>
                  <span className="font-medium text-sm text-secondary">Mercedes Benz</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-danger/10 text-danger rounded-full">Out of stock</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <Car size={20} className="text-gray-400" />
                  </div>
                  <span className="font-medium text-sm text-secondary">Toyota Palisade</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">Low Stock</span>
              </div>
              
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <Car size={20} className="text-gray-400" />
                  </div>
                  <span className="font-medium text-sm text-secondary">Hyundai Wuling</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-success/10 text-success rounded-full">Available</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
