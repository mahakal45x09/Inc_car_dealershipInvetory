import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axios';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, Fuel, Settings, Activity, Shield, Zap, Car, Tag, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import VehicleCard from '../../components/VehicleCard';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        // Fetch public vehicles and find the one matching ID
        const response = await api.get('/vehicles');
        const found = response.data.find(v => v.id === parseInt(id));
        
        if (found) {
          setVehicle(found);
          // Find related vehicles (same category, different ID)
          const related = response.data
            .filter(v => v.category === found.category && v.id !== found.id)
            .slice(0, 3);
          setRelatedVehicles(related);
        } else {
          toast.error("Vehicle not found.");
          navigate('/inventory');
        }
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        toast.error("Failed to load vehicle details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleDetails();
    // Reset quantity and active image when ID changes
    setQuantity(1);
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (quantity < 1 || quantity > vehicle.quantity) {
      toast.error("Invalid quantity selected.");
      return;
    }

    setIsPurchasing(true);
    try {
      // The backend expects a JSON body with 'quantity', not query params
      await api.post(`/vehicles/${vehicle.id}/purchase`, { quantity: parseInt(quantity) });
      toast.success(`Successfully purchased ${quantity} ${vehicle.make} ${vehicle.model}!`);
      // Update local state to reflect purchase (reduce stock)
      setVehicle(prev => ({ ...prev, quantity: prev.quantity - quantity }));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to complete purchase.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Mock Data Generators for specs not in DB
  const year = 2020 + (vehicle.id % 5);
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const fuelType = fuelTypes[vehicle.id % 4];
  const transmissions = ['Automatic', 'Manual'];
  const transmission = transmissions[vehicle.id % 2];
  const mileage = ((vehicle.id * 3141) % 50000) + 1000;
  
  const mockFeatures = [
    "Premium Leather Seats", "Navigation System", "Bluetooth Connectivity",
    "Backup Camera", "Heated Seats", "Sunroof/Moonroof", 
    "Alloy Wheels", "Adaptive Cruise Control"
  ].slice(0, 4 + (vehicle.id % 4));

  // Mock Gallery (just duplicating the main image with different filters for effect)
  const images = [
    vehicle.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
    vehicle.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
    vehicle.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
  ];

  const isOutOfStock = vehicle.quantity === 0;
  const totalPrice = vehicle.price * quantity;

  return (
    <div className="pb-24 w-full max-w-7xl mx-auto px-6 pt-28">
      {/* Back button */}
      <Link to="/inventory" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-semibold mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Inventory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-sm relative group"
            >
              <img 
                src={images[activeImage]} 
                alt={`${vehicle.make} ${vehicle.model}`} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200'; e.target.onerror = null; }}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${activeImage > 0 ? 'grayscale contrast-125' : ''}`}
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold text-gray-900 shadow-sm">
                  {vehicle.category}
                </span>
              </div>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-32 aspect-video rounded-xl overflow-hidden flex-shrink-0 transition-all ${activeImage === idx ? 'ring-4 ring-primary-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img 
                    src={img} 
                    alt={`Gallery ${idx}`} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'; e.target.onerror = null; }}
                    className={`w-full h-full object-cover ${idx > 0 ? 'grayscale contrast-125' : ''}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title and Overview */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              {vehicle.description || "Experience the perfect blend of performance, luxury, and cutting-edge technology. This vehicle has been meticulously maintained and is ready for its next adventure."}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="text-primary-500" /> Vehicle Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <Calendar className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Year</p>
                <p className="text-lg font-bold text-gray-900">{year}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <Fuel className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Fuel Type</p>
                <p className="text-lg font-bold text-gray-900">{fuelType}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <Settings className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Transmission</p>
                <p className="text-lg font-bold text-gray-900">{transmission}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <Activity className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Mileage</p>
                <p className="text-lg font-bold text-gray-900">{mileage.toLocaleString()} mi</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="text-primary-500" /> Premium Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Card */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 sticky top-28"
          >
            <div className="mb-6">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Price</span>
              <h2 className="text-4xl font-extrabold text-primary-600 mt-1">
                ${vehicle.price.toLocaleString()}
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="font-semibold text-gray-700">Status</span>
              </div>
              {isOutOfStock ? (
                <span className="font-bold text-red-500">Out of Stock</span>
              ) : (
                <span className="font-bold text-green-500">{vehicle.quantity} Available</span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">Select Quantity</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="flex-1 text-center text-2xl font-bold text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(vehicle.quantity, quantity + 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-end">
              <span className="font-semibold text-gray-500">Total</span>
              <span className="text-3xl font-extrabold text-gray-900">${totalPrice.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || isPurchasing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-gray-900/30'
              }`}
            >
              {isPurchasing ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : isOutOfStock ? (
                'Sold Out'
              ) : (
                'Confirm Purchase'
              )}
            </button>
            
            <div className="mt-6 flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <Shield className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                Your purchase is protected by AutoStock Pro's Buyer Guarantee. Free 7-day returns on all vehicles.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Vehicles */}
      {relatedVehicles.length > 0 && (
        <div className="mt-32 pt-12 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedVehicles.map((related, idx) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <VehicleCard vehicle={related} isPublic={true} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
