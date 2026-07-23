import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { Search, Plus, Edit2, Trash2, Package, MoreVertical, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VehicleForm from '../../components/VehicleForm';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        await api.delete(`/vehicles/${id}`);
        toast.success('Vehicle deleted successfully');
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (error) {
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      // Ensure numerical values
      const payload = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity)
      };

      if (selectedVehicle) {
        // Edit Mode
        const res = await api.put(`/vehicles/${selectedVehicle.id}`, payload);
        toast.success('Vehicle updated successfully');
        setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? res.data : v));
      } else {
        // Add Mode
        const res = await api.post('/vehicles', payload);
        toast.success('Vehicle added successfully');
        setVehicles([res.data, ...vehicles]);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save vehicle');
    }
  };

  // Filter & Sort Logic
  const processedVehicles = useMemo(() => {
    let result = [...vehicles];
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.make.toLowerCase().includes(q) || 
        v.model.toLowerCase().includes(q) || 
        v.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [vehicles, searchQuery, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(processedVehicles.length / itemsPerPage);
  const paginatedVehicles = processedVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 font-medium mt-1">Add, edit, or remove vehicles from your catalog.</p>
        </div>
        <button 
          onClick={() => { setSelectedVehicle(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search vehicles by make, model..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200/50 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium text-gray-900 outline-none"
            />
          </div>
          <div className="text-sm font-bold text-gray-500">
            Total: <span className="text-primary-500">{processedVehicles.length}</span> vehicles
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('make')}>
                  Vehicle {sortConfig.key === 'make' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('category')}>
                  Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('price')}>
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors" onClick={() => handleSort('quantity')}>
                  Status / Stock {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="flex gap-4"><div className="w-16 h-12 bg-gray-200 rounded-xl"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-24"></div><div className="h-3 bg-gray-200 rounded w-16"></div></div></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-gray-200 rounded-md w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-gray-200 rounded-md w-20"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-8 bg-gray-200 rounded-lg w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No vehicles found</h3>
                    <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {paginatedVehicles.map((vehicle, idx) => (
                    <motion.tr 
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={vehicle.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=150'} 
                            alt={vehicle.model} 
                            className="w-16 h-12 object-cover rounded-xl shadow-sm bg-gray-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">{vehicle.make} {vehicle.model}</p>
                            <p className="text-xs font-bold text-gray-400">ID: #{vehicle.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 shadow-sm">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900">
                        ${vehicle.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
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
                            {vehicle.quantity > 0 ? (vehicle.quantity > 5 ? 'In Stock' : 'Low Stock') : 'Out of Stock'}
                          </span>
                          <span className="text-sm font-bold text-gray-500">
                            ({vehicle.quantity})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setSelectedVehicle(vehicle); setIsModalOpen(true); }}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm font-medium text-xs flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm font-medium text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, processedVehicles.length)}</span> of <span className="font-bold text-gray-900">{processedVehicles.length}</span> entries
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-white shadow-sm"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-white shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <VehicleForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedVehicle}
      />
    </div>
  );
};

export default ManageVehicles;
