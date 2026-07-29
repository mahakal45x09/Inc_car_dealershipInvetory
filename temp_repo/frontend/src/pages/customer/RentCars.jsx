import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, CreditCard, Shield, Gauge } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RentCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/vehicles');
        // Let's assume all vehicles can be rented for now.
        setCars(response.data);
      } catch (err) {
        console.error("Failed to load vehicles", err);
        setError('Failed to load vehicles from the server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const openBookingModal = (car) => {
    if (!isAuthenticated) {
      alert("Please log in to rent a vehicle.");
      navigate('/login');
      return;
    }
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicle_id: selectedCar.id,
        start_date: new Date(bookingData.start_date).toISOString(),
        end_date: new Date(bookingData.end_date).toISOString()
      };
      await api.post('/bookings', payload);
      alert("Rental request submitted successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to submit rental", err);
      alert(err.response?.data?.detail || "Failed to submit rental request.");
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Rent a Vehicle</h1>
          <p className="text-gray-500">Flexible rentals for your next journey.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : error ? (
          <div className="text-center py-20 text-danger">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={car.id} 
                className="glass-card overflow-hidden group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop'} 
                    alt={`${car.make} ${car.model}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-md rounded text-xs font-bold text-secondary uppercase tracking-wider">
                    {car.category}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors mb-1">{car.make} {car.model}</h3>
                  <p className="text-xl font-bold text-primary mb-4">${(car.price * 0.005).toFixed(0)} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-500 mb-6 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Gauge size={14} className="text-gray-400" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-gray-400" />
                      <span>Insured</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openBookingModal(car)}
                    disabled={car.quantity <= 0}
                    className={`w-full font-medium py-2.5 rounded-lg transition-colors ${
                      car.quantity <= 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-accent hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {car.quantity <= 0 ? 'Unavailable' : 'Rent Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-secondary">Rent {selectedCar.make} {selectedCar.model}</h2>
              <p className="text-sm text-gray-500 mt-1">${(selectedCar.price * 0.005).toFixed(0)} / day</p>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Pick-up Date</label>
                <div className="relative">
                  <input required type="date" value={bookingData.start_date} onChange={(e) => setBookingData({...bookingData, start_date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Return Date</label>
                <div className="relative">
                  <input required type="date" value={bookingData.end_date} onChange={(e) => setBookingData({...bookingData, end_date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-accent hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
