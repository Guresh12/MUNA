import React from 'react';
import { ShoppingCart, MessageCircle, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello! I'm interested in ordering this product:

*${product.title}*
Price: KSH ${product.price.toLocaleString()}

${product.description}

Please let me know about availability and delivery options.`;
    const whatsappUrl = `https://wa.me/254722240558?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group w-full"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg relative">
        <img 
          src={
            product.product_images?.find(img => img.is_primary)?.image_url ||
            product.product_images?.[0]?.image_url ||
            product.image_url ||
            'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
          {renderStars(Math.floor(product.rating || 0))}
          <span className="text-xs sm:text-sm text-gray-500">
            ({product.reviews_count || 0})
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center gap-2">
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                KSH {product.compare_at_price.toLocaleString()}
              </span>
            )}
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              KSH {product.price.toLocaleString()}
            </span>
          </div>
          <div className="mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${product.in_stock !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.in_stock !== false ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 bg-green-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm"
            title="Order via WhatsApp"
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.in_stock === false}
            className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm ${
              product.in_stock === false
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;