import React from 'react';
import ProductHeroSlider from '../components/ProductHeroSlider';
import ShopSection from '../components/ShopSection';

const Home: React.FC = () => {
  return (
    <div className="pt-14 sm:pt-16">
      <ProductHeroSlider />
      <ShopSection />
    </div>
  );
};

export default Home;