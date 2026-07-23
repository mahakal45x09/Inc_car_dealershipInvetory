import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { Search, ChevronDown, ShoppingBag, ArrowUpRight, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Sort, Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, highest, lowest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/purchase/history');
        setHistory(response.data);
      } catch (err) {
        toast.error('Failed to load purchase history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filter and Sort logic
  const processedHistory = useMemo(() => {
    let result = [...history];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.vehicle.make.toLowerCase().includes(lowerQuery) ||
        item.vehicle.model.toLowerCase().includes(lowerQuery) ||
        item.vehicle.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      if (sortOrder === 'oldest') return new Date(a.created_at || Date.now()) - new Date(b.created_at || Date.now());
      if (sortOrder === 'highest') return b.total_price - a.total_price;
      if (sortOrder === 'lowest') return a.total_price - b.total_price;
      return 0;
    });

    return result;
  }, [history, searchQuery, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedHistory.length / itemsPerPage);
  const paginatedHistory = processedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 w-full max-w-5xl mx-auto px-6 pt-32 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
        <p className="text-gray-500 mt-2 font-medium">Review your past vehicle purchases and transactions.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search make, model, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium" 
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex-1 md:w-48 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-gray-900 font-medium appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Price: High to Low</option>
              <option value="lowest">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* List */}
        {processedHistory.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search or you haven't bought anything yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedHistory.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all cursor-pointer"
              >
                <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.vehicle.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=300'} 
                    alt={item.vehicle.model} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=300'; e.target.onerror = null; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-extrabold text-gray-900 text-xl group-hover:text-primary-600 transition-colors">
                    {item.vehicle.make} {item.vehicle.model}
                  </h4>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-sm text-gray-500 font-medium">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{item.vehicle.category}</span>
                    <span>•</span>
                    <span>{new Date(item.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="text-center md:text-right mt-4 md:mt-0">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-gray-900">
                    ${item.total_price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-center md:justify-end gap-1 mt-1 text-green-600 font-bold text-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Qty: {item.quantity}
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-colors ml-2">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 mt-8 pt-6">
            <span className="text-sm font-medium text-gray-500">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, processedHistory.length)}</span> of <span className="font-bold text-gray-900">{processedHistory.length}</span> entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' 
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
