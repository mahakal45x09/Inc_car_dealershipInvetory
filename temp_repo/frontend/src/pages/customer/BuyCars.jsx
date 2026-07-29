import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronDown, Heart, Shield, Gauge } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BuyCars() {
  const [priceRange, setPriceRange] = useState(100000);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/vehicles');
        setCars(response.data);
      } catch (err) {
        console.error("Failed to load vehicles", err);
        setError('Failed to load vehicles from the server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handlePurchase = async (carId) => {
    if (!isAuthenticated) {
      alert("Please log in to purchase a vehicle.");
      navigate('/login');
      return;
    }
    
    try {
      await api.post(`/vehicles/${carId}/purchase`);
      alert("Vehicle purchased successfully!");
      // Refresh inventory
      const response = await api.get('/vehicles');
      setCars(response.data);
    } catch (err) {
      console.error("Failed to purchase vehicle", err);
      alert(err.response?.data?.detail || "Failed to purchase vehicle. Out of stock?");
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Browse Vehicles</h1>
          <p className="text-gray-500">Find your perfect car from our premium inventory.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={18} className="text-primary" />
                <h3 className="font-bold text-secondary">Filters</h3>
              </div>
              
              {/* Search */}
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Search brand or model..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary">Max Price</span>
                  <span className="text-sm font-bold text-primary">${priceRange.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="200000" 
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Brand Filter */}
              <div className="mb-6 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold mb-3 flex justify-between items-center cursor-pointer">
                  Brands <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="space-y-2">
                  {['BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Toyota', 'Porsche'].map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="text-sm text-gray-600 group-hover:text-secondary">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Body Type Filter */}
              <div className="mb-6 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold mb-3 flex justify-between items-center cursor-pointer">
                  Body Type <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck'].map(type => (
                    <button key={type} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content: Vehicle Grid */}
          <div className="flex-1">
            
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500 font-medium">Showing {cars.length} results</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none cursor-pointer">
                  <option>Latest Arrival</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Mileage</option>
                </select>
                <button className="p-1.5 border border-gray-200 rounded-lg ml-2 hover:bg-gray-50 lg:hidden">
                  <SlidersHorizontal size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : error ? (
              <div className="text-center py-20 text-danger">{error}</div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No vehicles match your search criteria.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={car.id} 
                    className="glass-card overflow-hidden group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop'} 
                        alt={`${car.make} ${car.model}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors text-gray-600 hover:text-danger">
                        <Heart size={18} />
                      </button>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-md rounded text-xs font-bold text-secondary uppercase tracking-wider">
                        {car.category}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{car.make} {car.model}</h3>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-4">${car.price.toLocaleString()}</p>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-500 mb-6 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Gauge size={14} className="text-gray-400" />
                          <span>{car.year} Model</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield size={14} className="text-gray-400" />
                          <span>Certified</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handlePurchase(car.id)}
                        disabled={car.quantity <= 0}
                        className={`w-full font-medium py-2.5 rounded-lg transition-colors ${
                          car.quantity <= 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-primary hover:bg-blue-700 text-white'
                        }`}
                      >
                        {car.quantity <= 0 ? 'Out of Stock' : 'Buy Now'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
