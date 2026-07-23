import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const AdminVehicleForm = ({ vehicle, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (vehicle) {
      reset({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price,
        quantity: vehicle.quantity,
        description: vehicle.description || '',
        image_url: vehicle.image_url || ''
      });
    }
  }, [vehicle, reset]);

  const onSubmit = async (data) => {
    try {
      if (vehicle) {
        await api.put(`/vehicles/${vehicle.id}`, data);
        toast.success('Vehicle updated successfully');
      } else {
        await api.post('/vehicles', data);
        toast.success('Vehicle added successfully');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-indigo-950 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8">
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Make</label>
              <input id="make" type="text" {...register('make', { required: 'Make is required' })} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
              <input id="model" type="text" {...register('model', { required: 'Model is required' })} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input id="category" type="text" {...register('category', { required: 'Category is required' })} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
              <input id="image_url" type="text" {...register('image_url')} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
              <input id="price" type="number" step="0.01" {...register('price', { required: 'Price is required', min: 0.01, valueAsNumber: true })} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input id="quantity" type="number" {...register('quantity', { required: 'Quantity is required', min: 0, valueAsNumber: true })} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea id="description" {...register('description')} rows="3" className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/50">
              {isSubmitting ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminVehicleForm;
