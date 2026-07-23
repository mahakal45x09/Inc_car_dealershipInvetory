import React from 'react';

const VehicleCard = ({ vehicle, onPurchase }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/20 transition-all transform hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full group bg-white dark:bg-transparent">
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-indigo-900/50">
        <img 
          src={vehicle.image_url || 'https://via.placeholder.com/400x250?text=No+Image'} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          {vehicle.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-2">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatPrice(vehicle.price)}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 flex-1">
          {vehicle.description || 'No description available for this vehicle.'}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {vehicle.quantity} in stock
            </span>
          </div>
          
          <button
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 shadow-none' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/50 dark:bg-indigo-500 dark:hover:bg-indigo-400'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
