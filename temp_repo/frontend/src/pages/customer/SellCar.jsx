import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Car, Tag, DollarSign, FileText } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SellCar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    category: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'year' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to list your car for sale.");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Create the vehicle
      const vehiclePayload = {
        ...formData,
        quantity: 1, // Listing 1 car
      };
      
      const vehicleResponse = await api.post('/vehicles', vehiclePayload);
      const newVehicleId = vehicleResponse.data.id;

      // 2. Upload the image if provided
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        
        await api.post(`/vehicles/${newVehicleId}/image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      alert("Your car has been successfully listed for sale!");
      navigate('/buy'); // Redirect to marketplace

    } catch (err) {
      console.error("Failed to list car", err);
      setError(err.response?.data?.detail || 'Failed to list car. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-2">Sell Your Car</h1>
          <p className="text-gray-500">List your vehicle on our premium marketplace and reach thousands of buyers.</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 text-danger rounded-lg border border-danger/20">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imageFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                    <FileText size={24} />
                  </div>
                  <p className="font-medium text-secondary">{imageFile.name}</p>
                  <p className="text-sm text-gray-400 mt-1">Click to change photo</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-3">
                    <Upload size={24} />
                  </div>
                  <p className="font-medium text-secondary">Upload high-quality photo</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Make</label>
                <div className="relative">
                  <input required type="text" name="make" value={formData.make} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. BMW" />
                  <Car size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Model</label>
                <div className="relative">
                  <input required type="text" name="model" value={formData.model} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 3 Series" />
                  <Tag size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Year</label>
                <input required type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Category</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Category</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Truck">Truck</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1">Asking Price ($)</label>
                <div className="relative">
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                  <DollarSign size={20} className="absolute left-3 top-3.5 text-primary" />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Describe your vehicle's condition, features, and history..."></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/20'
                }`}
              >
                {isSubmitting ? 'Listing your car...' : 'List Car For Sale'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                By listing your car, you agree to our Terms of Service and Selling Guidelines.
              </p>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
