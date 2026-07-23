import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import VehicleCard from '../../components/VehicleCard';
import SearchFilter from '../../components/SearchFilter';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/vehicles/public?${params.toString()}`);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Premium Vehicles", value: "500+", icon: <Award className="w-5 h-5 text-orange-500" /> },
    { label: "Happy Customers", value: "10k+", icon: <ShieldCheck className="w-5 h-5 text-orange-500" /> },
    { label: "Fast Delivery", value: "24h", icon: <Zap className="w-5 h-5 text-orange-500" /> }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-[2rem] overflow-hidden bg-gray-900 mt-4 mx-4 sm:mx-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <img 
          src="/src/assets/images/cars/hero-car.png" 
          alt="Premium luxury car" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        
        <div className="relative z-20 px-8 py-20 sm:py-32 lg:px-16 flex flex-col items-start max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold tracking-wider mb-6 border border-orange-500/30">
              PREMIUM CAR PLATFORM
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">dream drive</span> today.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 font-medium mb-10 max-w-xl">
              Experience the pinnacle of automotive excellence. Browse our exclusive collection of premium vehicles and drive home luxury.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register" className="flex items-center gap-2 py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#inventory" className="flex items-center gap-2 py-4 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 transition-all">
                Browse Inventory
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-md border-t border-white/10 z-20 hidden md:block">
          <div className="flex justify-around items-center px-8 py-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1), duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-white/10 rounded-xl">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inventory Section */}
      <div id="inventory" className="px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Available Inventory</h2>
            <p className="text-gray-500 mt-1">Browse our latest collection of premium vehicles</p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <SearchFilter onFilterChange={setFilters} />
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                <img src="/src/assets/images/cars/empty-state.png" alt="No vehicles found" className="w-64 h-auto mb-8 rounded-2xl shadow-lg mix-blend-multiply opacity-80" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 max-w-md mx-auto">We couldn't find any vehicles matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={() => setFilters({})}
                  className="mt-6 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle, index) => (
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
    </div>
  );
};

export default Home;
