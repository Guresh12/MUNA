import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Jowhara Collection</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed">
              Your premier destination for luxury beauty and fragrance products. 
              We curate the finest collections from the world's most prestigious brands.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Categories</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/category/perfumes" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Perfumes</Link></li>
              <li><Link to="/category/skincare" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Skincare</Link></li>
              <li><Link to="/category/makeup" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Makeup</Link></li>
              <li><Link to="/category/hair-care" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Hair Care</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">info@johwaracollection.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">+254 722 240 558</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-4 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-xs sm:text-sm text-center md:text-left">
              © 2025 Jowhara Collection. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6 mt-3 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;