import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

export default function Inventory() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    category: '',
    quantity: 1,
    description: '',
    image_url: ''
  });

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
      setError('Failed to load inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'year' || name === 'quantity' ? Number(value) : value
    }));
  };

  const openAddModal = () => {
    setCurrentVehicle(null);
    setFormData({
      make: '', model: '', year: new Date().getFullYear(), price: '', category: '', quantity: 1, description: '', image_url: ''
    });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      category: vehicle.category,
      quantity: vehicle.quantity,
      description: vehicle.description || '',
      image_url: vehicle.image_url || ''
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentVehicle) {
        // Update
        await api.put(`/vehicles/${currentVehicle.id}`, formData);
      } else {
        // Create
        await api.post('/vehicles', formData);
      }
      setIsModalOpen(false);
      fetchVehicles(); // Refresh list
    } catch (err) {
      console.error("Failed to save vehicle", err);
      setError(err.response?.data?.detail || 'Failed to save vehicle.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        console.error("Failed to delete vehicle", err);
        alert("Failed to delete vehicle.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">Vehicle Inventory</h1>
          <p className="text-gray-500">Manage all vehicles currently in stock</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading inventory...</div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No vehicles in inventory. Add one to get started!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-secondary">{vehicle.make} {vehicle.model}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {vehicle.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vehicle.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vehicle.year}</td>
                    <td className="px-6 py-4 font-medium text-primary">${vehicle.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        vehicle.quantity > 5 ? 'bg-success/10 text-success' : 
                        vehicle.quantity > 0 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                      }`}>
                        {vehicle.quantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(vehicle)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(vehicle.id)} className="p-2 text-gray-400 hover:text-danger transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-secondary">
                {currentVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-secondary">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Make</label>
                  <input required type="text" name="make" value={formData.make} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. BMW" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Model</label>
                  <input required type="text" name="model" value={formData.model} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. M3" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Year</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Category</label>
                  <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select Category</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Truck">Truck</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Price ($)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Quantity in Stock</label>
                  <input required type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="0" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Image URL (Optional)</label>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://example.com/image.jpg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                  {currentVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
