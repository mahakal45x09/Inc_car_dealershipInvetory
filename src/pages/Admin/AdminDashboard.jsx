import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Car, Package, DollarSign, Users, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_vehicles: 0,
    total_value: 0,
    low_stock: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiclesRes, statsRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/vehicles/stats')
      ]);
      setVehicles(vehiclesRes.data);
      setStats({
        ...statsRes.data,
        low_stock: vehiclesRes.data.filter(v => v.quantity < 3).length
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  const statCards = [
    { label: 'Total Inventory', value: stats.total_vehicles, icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Value', value: `$${(stats.total_value || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Low Stock Alerts', value: stats.low_stock, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Users', value: '1,240', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your inventory, monitor sales, and control user access.</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5">
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow"
          >
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-gray-100 rounded-md w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-gray-100 rounded-md w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-gray-100 rounded-md w-16"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-8 bg-gray-100 rounded-lg w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No vehicles found in inventory.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle, index) => (
                  <motion.tr 
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={vehicle.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=150&h=100'} 
                          alt={vehicle.model} 
                          className="w-16 h-12 object-cover rounded-xl shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{vehicle.make} {vehicle.model}</p>
                          <p className="text-xs font-medium text-gray-500">ID: #{vehicle.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      ${vehicle.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        vehicle.quantity > 5 ? 'bg-green-100 text-green-700' :
                        vehicle.quantity > 0 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          vehicle.quantity > 5 ? 'bg-green-600' :
                          vehicle.quantity > 0 ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}></span>
                        {vehicle.quantity} {vehicle.quantity === 1 ? 'Unit' : 'Units'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">{vehicles.length}</span> of <span className="font-bold text-gray-900">{stats.total_vehicles}</span> entries</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
