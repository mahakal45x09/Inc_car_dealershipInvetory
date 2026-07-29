import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function LandingPage() {
  const brands = [
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
    { name: 'Mercedes', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' },
    { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
    { name: 'Porsche', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Porsche_logo.svg/1920px-Porsche_logo.svg.png' },
  ];

  const categories = [
    { name: 'Luxury SUVs', image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop' },
    { name: 'Sports Cars', image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop' },
    { name: 'Electric Models', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop' },
  ];

  const featuredCars = [
    { name: 'Porsche 911 Carrera', price: '$114,000', image: 'https://images.unsplash.com/photo-1503376760367-133527e7d692?q=80&w=1000&auto=format&fit=crop', spec1: '379 hp', spec2: '0-60 in 4.0s' },
    { name: 'Mercedes-Benz G-Class', price: '$139,900', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1000&auto=format&fit=crop', spec1: '416 hp', spec2: 'V8 Biturbo' },
    { name: 'Audi RS e-tron GT', price: '$143,900', image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000&auto=format&fit=crop', spec1: '637 hp', spec2: 'Electric AWD' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent z-10" />
          <img 
            src="/hero_luxury_car.png" 
            alt="Luxury Car" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full mt-16">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={STAGGER}
            className="max-w-2xl text-white"
          >
            <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Experience <br/><span className="text-primary">Automotive</span> <br/>Perfection.
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Discover the world's most premium vehicles. From electric pioneers to timeless classics, find the car that defines you.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-4">
              <Link to="/buy" className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium flex items-center justify-center transition-colors">
                Explore Inventory <ChevronRight size={18} className="ml-2" />
              </Link>
              <Link to="/rent" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-medium flex items-center justify-center transition-colors">
                Rent a Vehicle
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
          >
            Featured Brands
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
                className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
            <div className="flex justify-between items-end mb-12">
              <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl font-bold text-secondary">Find Your Style</motion.h2>
              <motion.div variants={FADE_UP}>
                <Link to="/buy" className="text-primary font-medium flex items-center hover:underline">
                  View All <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div key={i} variants={FADE_UP} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 p-8 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-gray-300 text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Explore Models <ChevronRight size={14} className="ml-1" />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="text-center mb-16">
            <motion.h2 variants={FADE_UP} className="text-3xl md:text-5xl font-bold mb-4">Featured Inventory</motion.h2>
            <motion.p variants={FADE_UP} className="text-gray-400 max-w-2xl mx-auto">Handpicked premium vehicles ready for immediate delivery.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{car.name}</h3>
                    <span className="text-primary font-bold">{car.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                    <div className="flex items-center gap-1"><Zap size={14} className="text-accent" /> {car.spec1}</div>
                    <div className="flex items-center gap-1"><Shield size={14} className="text-accent" /> {car.spec2}</div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-white text-secondary font-bold hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: 'Secure Transactions', desc: 'Every purchase is protected by bank-level encryption and our Buyer Guarantee.' },
              { icon: Award, title: 'Certified Vehicles', desc: 'Our inventory goes through a rigorous 150-point inspection by certified mechanics.' },
              { icon: Zap, title: 'Instant Approvals', desc: 'Get pre-approved for financing in minutes with our transparent checkout process.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
