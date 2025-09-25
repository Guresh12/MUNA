import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, ChevronDown, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand, Category } from '../types';
import { supabase } from '../lib/supabase';

const Navbar: React.FC = () => {
  const [isBrandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop with search query
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setBrandDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
         <div className="flex-shrink-0 min-w-0">
  <Link to="/" className="flex items-center space-x-3">
    <img 
      src="/JWLOGO.jpeg" 
      alt="Jowhara Collection Logo" 
      className="h-8 sm:h-10 w-auto object-contain"
    />
    <div className="flex flex-col min-w-0">
      <h1 className="text-sm sm:text-xl font-bold text-black truncate">Jowhara Collection</h1>
      <p className="text-xs text-gray-600 hidden sm:block">Beauty & Fragrance</p>
    </div>
  </Link>
</div>

          {/* Navigation Links */}
          <div className="hidden lg:block">
            <div className="ml-4 xl:ml-10 flex items-baseline space-x-4 xl:space-x-8">
              <Link to="/" className="text-black hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              
              {/* Browse by Category Dropdown */}
              <div className="relative hidden xl:block" ref={categoryDropdownRef}>
                <button
                  onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="text-black hover:text-yellow-600 px-3 py-2 text-sm font-medium inline-flex items-center transition-colors"
                >
                  Browse by Category
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setCategoryDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Browse by Brand Dropdown */}
              <div className="relative hidden xl:block" ref={brandDropdownRef}>
                <button
                  onClick={() => setBrandDropdownOpen(!isBrandDropdownOpen)}
                  className="text-black hover:text-yellow-600 px-3 py-2 text-sm font-medium inline-flex items-center transition-colors"
                >
                  Browse by Brand
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isBrandDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-2">
                      {brands.map((brand) => (
                        <Link
                          key={brand.id}
                          to={`/brand/${brand.name.toLowerCase()}`}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setBrandDropdownOpen(false)}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex-shrink-0 flex items-center justify-center mr-3">
                            {brand.logo_url ? (
                              <img 
                                src={brand.logo_url} 
                                alt={brand.name}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <span className="text-xs font-bold text-gray-600">{brand.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-black">{brand.name}</h3>
                            <p className="text-xs text-gray-600">{brand.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/shop" className="text-black hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-black hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-black hover:text-yellow-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="hidden md:block w-32 lg:w-48 xl:w-64 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <button 
                  type="submit"
                  className="ml-1 sm:ml-2 text-black hover:text-yellow-600 transition-colors"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </form>
            </div>
            <button className="text-black hover:text-yellow-600 transition-colors relative">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 h-3 w-3 sm:h-4 sm:w-4 bg-yellow-600 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <Link to="/admin" className="text-black hover:text-yellow-600 transition-colors">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className="lg:hidden border-t border-gray-200 py-2">
          <div className="flex justify-center space-x-6">
            <Link to="/shop" className="text-black hover:text-yellow-600 px-2 py-1 text-sm font-medium transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-black hover:text-yellow-600 px-2 py-1 text-sm font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-black hover:text-yellow-600 px-2 py-1 text-sm font-medium transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
