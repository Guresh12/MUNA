import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MessageCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductImage } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(id, image_url, is_primary, order_index),
          brand:brands(name, description),
          category:categories(name, description)
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      setProduct(data);
      
      // Set up product images
      const images = data.product_images || [];
      if (images.length > 0) {
        // Sort images by primary status first, then by order_index
        const sortedImages = images.sort((a: ProductImage, b: ProductImage) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.order_index || 0) - (b.order_index || 0);
        });
        setProductImages(sortedImages);
        setSelectedImageIndex(0);
      } else if (data.image_url) {
        // Fallback to legacy image_url
        setProductImages([{
          id: 'legacy',
          product_id: data.id,
          image_url: data.image_url,
          is_primary: true,
          order_index: 0
        }]);
        setSelectedImageIndex(0);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    const message = `Hello! I'm interested in ordering this product:

*${product.title}*
Price: KSH ${product.price.toLocaleString()}
Quantity: ${quantity}
Total: KSH ${(product.price * quantity).toLocaleString()}

${product.description}

Please let me know about availability and delivery options.`;
    
    const whatsappUrl = `https://wa.me/254722240558?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Add to cart:', product?.id, 'quantity:', quantity);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const currentImage = productImages[selectedImageIndex];
  const fallbackImage = 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black transition-colors mb-4 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                {currentImage ? (
                  <>
                    <img
                      src={currentImage.image_url || fallbackImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                      }}
                    />
                    
                    {/* Navigation arrows for main image */}
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200"
                        >
                          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200"
                        >
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm sm:text-base">No image available</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => selectImage(index)}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 ${
                        index === selectedImageIndex
                          ? 'border-yellow-500 ring-2 ring-yellow-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImage;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                {product.brand && (
                  <p className="text-base sm:text-lg text-gray-600">by {product.brand.name}</p>
                )}
                {product.category && (
                  <p className="text-sm text-gray-500">{product.category.name}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {renderStars(Math.floor(product.rating || 0))}
                  <span className="text-sm sm:text-base text-gray-600">
                    ({product.rating?.toFixed(1) || '0.0'})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {product.reviews_count || 0} reviews
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                KSH {product.price.toLocaleString()}
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex-1 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Order via WhatsApp
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white px-4 sm:px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 sm:pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Stock:</span>
                    <span className="ml-2 text-gray-600">{product.stock} available</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-600">{product.category?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;