import React from 'react';
import Hero from '../components/Hero';
import ShopSection from '../components/ShopSection';

const Home: React.FC = () => {
  return (
    <div className="pt-16">
      <Hero />
      <ShopSection />
    </div>
  );
};

export default Home;