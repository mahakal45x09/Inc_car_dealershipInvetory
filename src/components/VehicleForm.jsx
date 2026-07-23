import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Image as ImageIcon } from 'lucide-react';

const VehicleForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      make: '', model: '', category: 'Luxury Sedans', price: '', quantity: '', image_url: '', description: ''
    }
  });

  // Reset form when initialData changes (e.g. switching from Add to Edit)
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ make: '', model: '', category: 'Luxury Sedans', price: '', quantity: '', image_url: '', description: '' });
    }
  }, [initialData, reset]);

  const imageUrl = watch('image_url');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 scrollbar-hide flex flex-col"
        >
          <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 flex justify-between items-center z-20">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <p className="text-gray-500 font-medium text-sm mt-1">Enter the vehicle details below.</p>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            
            {/* Image Preview */}
            <div className="flex gap-6 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-32 h-24 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; e.target.onerror = null; }} />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Image URL</label>
                <input 
                  type="url" 
                  {...register('image_url')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Make <span className="text-red-500">*</span></label>
                <input type="text" {...register('make', { required: 'Make is required' })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium text-gray-900" placeholder="e.g. BMW" />
                {errors.make && <span className="text-xs font-bold text-red-500">{errors.make.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Model <span className="text-red-500">*</span></label>
                <input type="text" {...register('model', { required: 'Model is required' })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium text-gray-900" placeholder="e.g. M4 Competition" />
                {errors.model && <span className="text-xs font-bold text-red-500">{errors.model.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                <select {...register('category', { required: 'Category is required' })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium text-gray-900">
                  <option value="Luxury Sedans">Luxury Sedans</option>
                  <option value="Sports Cars">Sports Cars</option>
                  <option value="Electric SUVs">Electric SUVs</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">Price ($) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" {...register('price', { required: 'Price is required', min: 0 })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium text-gray-900" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">Stock Qty <span className="text-red-500">*</span></label>
                  <input type="number" {...register('quantity', { required: 'Quantity is required', min: 0 })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium text-gray-900" placeholder="0" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Description</label>
              <textarea {...register('description')} rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium text-gray-900 resize-none" placeholder="Enter vehicle description..."></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5">
                <Save className="w-4 h-4" />
                {initialData ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleForm;
