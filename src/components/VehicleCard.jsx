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
    <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col h-full group p-5">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-2">
        <div>
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={vehicle.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm border border-white/20">
            {vehicle.category}
          </span>
        </div>
        {isOutOfStock && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              {vehicle.quantity} {vehicle.quantity === 1 ? 'unit' : 'units'} available
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-orange-600">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 mb-4 border-y border-gray-50 mt-auto">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">Auto</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-1 border-x border-gray-50">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">Electric</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <Key className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">New</span>
          </div>
        </div>

        {isPublic ? (
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}
            {!isOutOfStock && <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <button
            onClick={onPurchase}
            disabled={isOutOfStock}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-orange-500/30'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
            {!isOutOfStock && <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
