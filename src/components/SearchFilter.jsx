import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Car, Type, DollarSign, Calendar, Fuel, Settings, CheckCircle } from 'lucide-react';

const SearchFilter = ({ onFilterChange }) => {
  const emptyFilters = {
    make: '',
    model: '',
    category: '',
    min_price: '',
    max_price: '',
    year: '',
    fuelType: '',
    transmission: '',
    availability: ''
  };

  const [filters, setFilters] = useState(emptyFilters);

  const categories = ['Luxury Sedans', 'Sports Cars', 'Electric SUVs', 'SUV', 'Truck', 'Coupe', 'Convertible'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['Automatic', 'Manual'];
  const years = [2024, 2023, 2022, 2021, 2020];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // Live Search - trigger immediately on change
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 sticky top-28">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-extrabold text-gray-900">Advanced Filters</h2>
        </div>
        <button 
          onClick={handleReset}
          className="text-sm font-bold text-gray-400 hover:text-primary-500 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="space-y-4">
        {/* Make */}
        <div className="space-y-1.5 group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Make</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Car className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              name="make"
              value={filters.make}
              onChange={handleChange}
              placeholder="e.g. BMW" 
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900" 
            />
          </div>
        </div>

        {/* Model */}
        <div className="space-y-1.5 group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Model</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              name="model"
              value={filters.model}
              onChange={handleChange}
              placeholder="e.g. M4" 
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900" 
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5 group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input 
                type="number" 
                name="min_price"
                value={filters.min_price}
                onChange={handleChange}
                placeholder="Min" 
                className="w-full pl-8 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900" 
              />
            </div>
            <span className="text-gray-400 font-bold">-</span>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input 
                type="number" 
                name="max_price"
                value={filters.max_price}
                onChange={handleChange}
                placeholder="Max" 
                className="w-full pl-8 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900" 
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
          <select 
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900 appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Year</label>
          <select 
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900 appearance-none"
          >
            <option value="">Any Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Fuel Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Fuel className="w-3 h-3" /> Fuel Type</label>
          <select 
            name="fuelType"
            value={filters.fuelType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900 appearance-none"
          >
            <option value="">Any Fuel Type</option>
            {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Transmission */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Settings className="w-3 h-3" /> Transmission</label>
          <select 
            name="transmission"
            value={filters.transmission}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900 appearance-none"
          >
            <option value="">Any Transmission</option>
            {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Availability */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Availability</label>
          <select 
            name="availability"
            value={filters.availability}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium text-gray-900 appearance-none"
          >
            <option value="">All Vehicles</option>
            <option value="in_stock">In Stock Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
