import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Gauge, Key, ChevronRight, Fuel, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const VehicleCard = ({ vehicle, isPublic = false, onPurchase }) => {
  const navigate = useNavigate();
  
  const handlePurchase = (e) => {
    e.stopPropagation();
    if (onPurchase) {
      onPurchase();
    } else {
      // Instead of forcing a login redirect, navigate to the vehicle details page 
      // where they can choose quantity and complete the transaction.
      navigate(`/vehicles/${vehicle.id}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  const isOutOfStock = vehicle.quantity === 0;

  // Mock data for fields not in DB based on ID for consistency
  const year = 2020 + (vehicle.id % 5);
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const fuelType = fuelTypes[vehicle.id % 4];
  const transmissions = ['Automatic', 'Manual'];
  const transmission = transmissions[vehicle.id % 2];
  const mileage = ((vehicle.id * 3141) % 50000) + 1000;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden group flex flex-col h-full cursor-pointer transition-shadow duration-300"
      onClick={handleViewDetails}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={vehicle.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800'}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'; e.target.onerror = null; }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm border border-white/20">
            {vehicle.category}
          </span>
        </div>
        {isOutOfStock ? (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm">
              Out of Stock
            </span>
          </div>
        ) : (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm">
              Available
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              {vehicle.quantity} {vehicle.quantity === 1 ? 'unit' : 'units'} in stock
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-primary-600">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-3 py-4 mb-4 border-y border-gray-50 mt-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">{year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">{fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">{transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">{mileage.toLocaleString()} mi</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-gray-200"
          >
            Details
          </button>
          
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock}
            className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-primary-500/30'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : 'Buy Now'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
