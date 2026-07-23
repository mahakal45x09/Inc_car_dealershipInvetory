import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/axios';
import VehicleCard from '../../components/VehicleCard';
import SearchFilter from '../../components/SearchFilter';
import PurchaseModal from '../../components/PurchaseModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async (filters = null) => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (filters) {
        response = await api.get('/vehicles/search', { params: filters });
      } else {
        response = await api.get('/vehicles', { params: {} });
      }
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = (filters) => {
    fetchVehicles(filters);
  };

  const handleReset = () => {
    fetchVehicles();
  };

  const handlePurchase = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl tracking-tight">
          Vehicle Inventory
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Welcome back, {user?.role === 'ADMIN' ? 'Admin' : 'User'}. Browse our latest collection of premium vehicles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <SearchFilter onSearch={handleSearch} onReset={handleReset} />

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64" role="status">
              <svg className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center shadow-lg">
              <p className="text-red-600 dark:text-red-400 font-semibold text-lg">{error}</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center border border-gray-200 dark:border-white/10 shadow-2xl">
              <span className="text-5xl mb-6 block">🔍</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No vehicles found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Try adjusting your search filters to find what you're looking for.</p>
              <button onClick={handleReset} className="mt-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold py-2 px-6 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={handlePurchase} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedVehicle && (
        <PurchaseModal 
          vehicle={selectedVehicle} 
          onClose={() => setSelectedVehicle(null)} 
          onSuccess={() => fetchVehicles()} 
        />
      )}
    </div>
  );
};

export default Dashboard;
