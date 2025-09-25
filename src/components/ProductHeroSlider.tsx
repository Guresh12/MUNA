import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const ProductHeroSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [products.length]);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(name),
          category:categories(name)
        `)
        .order('rating', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">
          {rating.toFixed(1)} ({products[currentSlide]?.reviews_count || 0} reviews)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentSlide];

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-[500px] bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      {/* Main Slider Content */}
      <div className="relative h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 h-full items-center">
            
            {/* Left Content */}
            <div className="space-y-3 sm:space-y-6 text-center lg:text-left px-4 lg:px-0">
              <div>
                <p className="text-xs sm:text-sm font-medium text-yellow-600 uppercase tracking-wide">
                  {currentProduct.brand?.name}
                </p>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                  {currentProduct.title}
                </h1>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {renderStars(currentProduct.rating || 0)}
                <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {currentProduct.description}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  KSH {currentProduct.price.toLocaleString()}
                </div>
                <button
                  onClick={() => handleViewProduct(currentProduct.id)}
                  className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-gray-800 transition-colors font-medium text-base sm:text-lg"
                >
                  View Product
                </button>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative h-full flex items-center justify-center px-4 lg:px-0">
              <div className="aspect-square w-full max-w-xs sm:max-w-md overflow-hidden rounded-lg shadow-lg">
                <img
                  src={currentProduct.image_url || 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 z-10"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 z-10"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-yellow-600 scale-110'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Slide Indicator */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
        {currentSlide + 1} / {products.length}
      </div>
    </div>
  );
};

export default ProductHeroSlider;