import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import { Sparkles } from '../components/ui/Sparkles';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section with 3D effects */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="cta-section py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <Sparkles 
            className="cta-content text-center max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            minSize={0.5}
            maxSize={1.5}
            particleDensity={50}
            particleColor="#3b82f6"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of university students who are already exchanging skills and knowledge.
            </p>
            {user ? (
              <Link to="/browse" className="btn primary btn-lg px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                Browse Skills
              </Link>
            ) : (
              <Link to="/register" className="btn primary btn-lg px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                Join Now - It's Free
              </Link>
            )}
          </Sparkles>
        </div>
      </section>
    </div>
  );
};

export default Home;