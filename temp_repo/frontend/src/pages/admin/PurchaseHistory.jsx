import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart } from 'lucide-react';
import api from '../../services/api';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        // Fetch all purchases (Admin only route)
        const response = await api.get('/admin/purchases');
        setPurchases(response.data);
      } catch (err) {
        console.error("Failed to fetch purchases", err);
        setError('Failed to load purchase history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">Purchase History</h1>
          <p className="text-gray-500">View all customer vehicle purchases</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading history...</div>
        ) : error ? (
          <div className="p-12 text-center text-danger">{error}</div>
        ) : purchases.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No purchases have been made yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map(purchase => (
                  <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      TXN-{purchase.id.toString().padStart(5, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-secondary">{purchase.user?.full_name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{purchase.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                          {purchase.vehicle?.image_url ? (
                            <img src={purchase.vehicle.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-secondary">{purchase.vehicle?.make} {purchase.vehicle?.model}</div>
                          <div className="text-xs text-gray-500">{purchase.vehicle?.year} • {purchase.vehicle?.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                      <div className="text-xs text-gray-400">
                        {new Date(purchase.purchase_date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center text-sm font-bold text-emerald-600">
                        <DollarSign size={14} className="mr-0.5" />
                        {purchase.price.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
