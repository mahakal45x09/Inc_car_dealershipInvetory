import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Zap, Award, Search, Users, Car, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import VehicleCard from '../../components/VehicleCard';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vehicles');
        setFeaturedCars(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const brands = [
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
    { name: 'Mercedes', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' },
    { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
    { name: 'Porsche', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Porsche_logo.svg/1920px-Porsche_logo.svg.png' },
  ];

  const categories = [
    { name: 'Luxury Sedans', image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop' },
    { name: 'Sports Cars', image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop' },
    { name: 'Electric SUVs', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent z-10" />
          <img 
            src="/src/assets/images/cars/hero-car.png" 
            alt="Luxury Car" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full mt-20">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={STAGGER}
            className="max-w-2xl text-white"
          >
            <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Drive Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Dream Car</span> <br/>Today.
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-lg md:text-xl text-gray-300 font-medium mb-10 leading-relaxed max-w-xl">
              Experience the world's most premium vehicles. Unmatched luxury, incredible performance, and transparent pricing.
            </motion.p>
            
            {/* Search Bar in Hero */}
            <motion.form variants={FADE_UP} onSubmit={handleSearch} className="flex bg-white p-2 rounded-2xl shadow-2xl max-w-lg mb-8">
              <div className="flex-1 flex items-center pl-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search make, model, or year..."
                  className="w-full pl-3 pr-4 py-3 bg-transparent border-0 focus:ring-0 text-gray-900 font-medium placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                Search
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-30 -mt-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-1">5K+</h3>
            <p className="text-gray-500 font-semibold text-sm">Vehicles Sold</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-1">99%</h3>
            <p className="text-gray-500 font-semibold text-sm">Happy Clients</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-1">24/7</h3>
            <p className="text-gray-500 font-semibold text-sm">Customer Support</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-1">150+</h3>
            <p className="text-gray-500 font-semibold text-sm">Awards Won</p>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-10"
          >
            Popular Brands
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
            {brands.map((brand, i) => (
              <motion.img 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                src={brand.logo} 
                alt={brand.name} 
                className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-110"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
            <div className="flex justify-between items-end mb-12">
              <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Shop by Category</motion.h2>
              <motion.div variants={FADE_UP}>
                <Link to="/inventory" className="text-primary-500 font-bold flex items-center hover:text-primary-600 transition-colors">
                  View All Categories <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div key={i} variants={FADE_UP} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent z-10" />
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-gray-300 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Explore Models <ChevronRight size={14} className="ml-1" />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured/Latest Vehicles Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="text-center mb-16">
            <motion.h2 variants={FADE_UP} className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">Featured Vehicles</motion.h2>
            <motion.p variants={FADE_UP} className="text-gray-500 font-medium max-w-2xl mx-auto">Handpicked premium vehicles ready for immediate delivery.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white h-[450px] rounded-[2rem] animate-pulse border border-gray-100 shadow-sm"></div>
              ))
            ) : featuredCars.length === 0 ? (
               <div className="col-span-3 text-center py-12">
                 <p className="text-gray-500 font-medium">No featured vehicles available at the moment.</p>
               </div>
            ) : (
              featuredCars.map((car, i) => (
                <motion.div 
                  key={car.id || i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <VehicleCard vehicle={car} isPublic={true} />
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/inventory" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
              View All Vehicles <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-primary-500 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary-500/20">
            {/* Abstract background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="text-center md:text-left max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Ready to drive your dream car?</h2>
                <p className="text-primary-100 text-lg font-medium mb-8">Join thousands of satisfied customers who found their perfect vehicle with AutoStock Pro. Sign up today and get access to exclusive deals.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-all hover:-translate-y-1 text-center">
                    Create an Account
                  </Link>
                  <Link to="/inventory" className="bg-primary-600 border border-primary-400 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors text-center">
                    Browse Inventory
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative w-1/3 h-64">
                <img src="/src/assets/images/cars/hero-car.png" alt="CTA Car" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
