import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/axios';
import VehicleCard from '../../components/VehicleCard';
import SearchFilter from '../../components/SearchFilter';
import { motion } from 'framer-motion';

const Inventory = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Initial fetch of all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vehicles');
        setAllVehicles(response.data);
        setFilteredVehicles(response.data); // Initialize with all
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Handle URL query parameters (from Home page search)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get('search');
    
    if (initialSearch && allVehicles.length > 0) {
      const lowerQuery = initialSearch.toLowerCase();
      const filtered = allVehicles.filter(v => 
        v.make.toLowerCase().includes(lowerQuery) || 
        v.model.toLowerCase().includes(lowerQuery)
      );
      setFilteredVehicles(filtered);
    }
  }, [location.search, allVehicles]);

  const handleFilterChange = (filters) => {
    if (allVehicles.length === 0) return;

    let result = [...allVehicles];

    if (filters.make) {
      result = result.filter(v => v.make.toLowerCase().includes(filters.make.toLowerCase()));
    }
    if (filters.model) {
      result = result.filter(v => v.model.toLowerCase().includes(filters.model.toLowerCase()));
    }
    if (filters.category) {
      result = result.filter(v => v.category === filters.category);
    }
    if (filters.min_price) {
      result = result.filter(v => v.price >= parseFloat(filters.min_price));
    }
    if (filters.max_price) {
      result = result.filter(v => v.price <= parseFloat(filters.max_price));
    }
    
    // Frontend-only mock filters (based on deterministic assignment in VehicleCard)
    if (filters.year) {
      result = result.filter(v => (2020 + (v.id % 5)).toString() === filters.year);
    }
    if (filters.fuelType) {
      const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
      result = result.filter(v => fuelTypes[v.id % 4] === filters.fuelType);
    }
    if (filters.transmission) {
      const transmissions = ['Automatic', 'Manual'];
      result = result.filter(v => transmissions[v.id % 2] === filters.transmission);
    }
    if (filters.availability === 'in_stock') {
      result = result.filter(v => v.quantity > 0);
    }

    setFilteredVehicles(result);
  };

  return (
    <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto px-6 pt-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-2 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Vehicle Inventory</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Browse our premium collection of {filteredVehicles.length} vehicles</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-80 flex-shrink-0">
          <SearchFilter onFilterChange={handleFilterChange} />
        </div>
        
        <div className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white h-[420px] rounded-[2rem] shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-56 bg-gray-100 rounded-t-[2rem]"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-100 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                    <div className="h-10 bg-gray-100 rounded-xl mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
              <img src="/src/assets/images/cars/empty-state.png" alt="No vehicles found" className="w-64 h-auto mb-8 rounded-2xl shadow-lg mix-blend-multiply opacity-80" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500 max-w-md mx-auto font-medium">We couldn't find any vehicles matching your current filters. Try adjusting your search criteria or resetting filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <VehicleCard vehicle={vehicle} isPublic={true} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
