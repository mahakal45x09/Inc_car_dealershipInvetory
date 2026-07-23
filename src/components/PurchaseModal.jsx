import React, { useState } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const PurchaseModal = ({ vehicle, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!vehicle) return null;

  const handlePurchase = async () => {
    setErrorMsg('');
    if (quantity < 1) {
      setErrorMsg('Quantity must be at least 1');
      return;
    }
    if (quantity > vehicle.quantity) {
      setErrorMsg(`Cannot purchase more than ${vehicle.quantity}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/vehicles/${vehicle.id}/purchase`, null, { params: { quantity } });
      toast.success(`Successfully purchased ${quantity} ${vehicle.make} ${vehicle.model}!`);
      onSuccess();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to complete purchase.';
      setErrorMsg(detail);
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(vehicle.price * quantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-indigo-950 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-white/10">
        
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Purchase {vehicle.make} {vehicle.model}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Available</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{vehicle.quantity} in stock</span>
          </div>

          {errorMsg && (
            <div className="p-3 text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity to Purchase
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={vehicle.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-black/30 p-6 sm:px-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/50 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Confirm Purchase
          </button>
        </div>

      </div>
    </div>
  );
};

export default PurchaseModal;
