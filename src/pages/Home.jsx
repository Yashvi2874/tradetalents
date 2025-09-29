import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Removed Header since it's now in App.jsx */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
      </main>
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Home;