import React from 'react';
import { Award, Heart, Truck, Shield } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We source only the finest luxury products from authorized distributors'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Dedicated customer service to help you find your perfect fragrance'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Quick and secure delivery to your doorstep worldwide'
    },
    {
      icon: Shield,
      title: 'Authentic Products',
      description: '100% authentic products with satisfaction guarantee'
    }
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Jowhara Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your premier destination for luxury beauty and fragrance products. 
              We curate the finest collections from the world's most prestigious brands.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded with a passion for luxury and beauty, Jowhara Collection has been 
                serving discerning customers who appreciate the finest in fragrance and cosmetics. 
                Our journey began with a simple mission: to make luxury beauty accessible to everyone.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to offer an extensive collection of premium products from 
                renowned brands like Chanel, Dior, Tom Ford, and Versace, ensuring that our 
                customers have access to the very best in beauty and fragrance.
              </p>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1961785/pexels-photo-1961785.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Luxury beauty products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best luxury shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-yellow-600 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;