import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <FiClock className="text-indigo-500" /> 
          Purchase History
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">View your past vehicle purchases and transactions</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No purchases yet</h3>
          <p className="text-gray-500 dark:text-gray-400">When you buy a car, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {item.vehicle.make} {item.vehicle.model}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.vehicle.category} &bull; Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  ${item.total_price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
