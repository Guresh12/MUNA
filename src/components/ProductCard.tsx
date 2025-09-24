import React from 'react';
import { ShoppingCart, MessageCircle, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Add to cart:', product.id);
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
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img 
          src={
            product.product_images?.find(img => img.is_primary)?.image_url ||
            product.product_images?.[0]?.image_url ||
            product.image_url ||
            'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          {renderStars(Math.floor(product.rating || 0))}
          <span className="text-xs text-gray-500">
            ({product.reviews_count || 0})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            KSH {product.price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleWhatsAppOrder}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
              title="Order via WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;