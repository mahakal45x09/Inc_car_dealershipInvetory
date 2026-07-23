import React from 'react';
import { Car, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                AutoStock Pro
              </span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed">
              Experience the pinnacle of automotive excellence with AutoStock Pro's premium vehicle selection. Your journey starts here.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Home</Link></li>
              <li><Link to="/inventory" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Inventory</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">Top Categories</h3>
            <ul className="space-y-4">
              <li><Link to="/inventory?category=Luxury" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Luxury Sedans</Link></li>
              <li><Link to="/inventory?category=SUV" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Premium SUVs</Link></li>
              <li><Link to="/inventory?category=Sports" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Sports Cars</Link></li>
              <li><Link to="/inventory?category=Electric" className="text-gray-500 hover:text-primary-500 font-medium transition-colors">Electric Vehicles</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 font-medium">LD College of Engineering, Ahmedabad 380015</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-500 font-medium">+91 7096127738</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-500 font-medium">ketanmahakal123@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 font-medium text-sm">
            &copy; {new Date().getFullYear()} AutoStock Pro Automotive. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
