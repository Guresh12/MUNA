import React from 'react';
import { MessageCircle } from 'lucide-react';

const Hero: React.FC = () => {
  const handleWhatsAppOrder = () => {
    const message = "Hello! I'm interested in your luxury beauty and fragrance products. Could you please help me with my order?";
    const whatsappUrl = `https://wa.me/254722240558?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
      style={{
       backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/myhero.jpeg')`,
  }}
    >
      <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
          Luxury Beauty & Fragrance
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200 leading-relaxed">
          Discover our premium collection of beauty and fragrance products
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <button 
            onClick={() => window.location.href = '/shop'}
            className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-base sm:text-lg min-w-[140px] sm:min-w-[160px]"
          >
            Shop Now
          </button>
          <button 
            onClick={handleWhatsAppOrder}
            className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium hover:bg-white hover:text-black transition-colors text-base sm:text-lg min-w-[140px] sm:min-w-[160px] flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
