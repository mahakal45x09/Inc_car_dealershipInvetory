import React, { useState } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Package, ShieldCheck, CreditCard } from 'lucide-react';

const PurchaseModal = ({ vehicle, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to complete purchase.';
      setErrorMsg(detail);
      toast.error(detail);
      setIsSubmitting(false);
    }
  };

  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(vehicle.price * quantity);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSuccess ? onClose : undefined}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100"
        >
          {isSuccess ? (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-gray-900">Purchase Confirmed!</h2>
              <p className="text-gray-500 font-medium max-w-xs">
                Your purchase of {quantity} {vehicle.make} {vehicle.model} has been processed successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={vehicle.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 pr-6">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-2 inline-block">
                    {vehicle.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {vehicle.make} {vehicle.model}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Price per unit</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">${vehicle.price.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Available Stock</span>
                    </div>
                    <p className="text-lg font-bold text-orange-700">{vehicle.quantity} Units</p>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    {errorMsg}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label htmlFor="quantity" className="block text-sm font-bold text-gray-700">
                    Select Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max={vehicle.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={vehicle.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500 text-center font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Total Payment</p>
                    <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{totalPrice}</p>
                  </div>
                  <ShieldCheck className="w-10 h-10 text-gray-300" />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Confirm Purchase'
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PurchaseModal;
