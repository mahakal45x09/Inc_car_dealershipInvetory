import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Car, Type, DollarSign } from 'lucide-react';

const SearchFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    min_price: '',
    max_price: ''
  });

  const categories = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Electric'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      make: '',
      model: '',
      category: '',
      min_price: '',
      max_price: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <button 
          onClick={handleReset}
          className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5 group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Make</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Car className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input 
              type="text" 
              name="make"
              value={filters.make}
              onChange={handleChange}
              placeholder="e.g. Toyota" 
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-900" 
            />
          </div>
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Model</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input 
              type="text" 
              name="model"
              value={filters.model}
              onChange={handleChange}
              placeholder="e.g. Camry" 
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-900" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
          <select 
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-3 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-900 appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input 
                type="number" 
                name="min_price"
                value={filters.min_price}
                onChange={handleChange}
                placeholder="Min" 
                className="w-full pl-8 pr-3 py-3 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-900" 
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input 
                type="number" 
                name="max_price"
                value={filters.max_price}
                onChange={handleChange}
                placeholder="Max" 
                className="w-full pl-8 pr-3 py-3 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-900" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
        >
          <Search className="w-4 h-4" /> Apply Filters
        </button>
      </form>
    </div>
  );
};

export default SearchFilter;
