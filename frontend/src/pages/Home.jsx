import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section with 3D effects */}
      <motion.section 
        className="hero-section gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Unlock Your Potential with <span className="text-primary">Trade Talents</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Connect with fellow university students to exchange skills, knowledge, and experiences. 
              Learn from the best and become the best.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {user ? (
                <Link to="/dashboard" className="btn primary btn-lg float">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn primary btn-lg float">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn secondary btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
            
            <motion.div 
              className="hero-stats"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Skills Available</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Sessions Completed</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="hero-visual"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="floating-elements">
              <div className="floating-element element-1 float"></div>
              <div className="floating-element element-2 float delay-1s"></div>
              <div className="floating-element element-3 float delay-2s"></div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of university students who are already exchanging skills and knowledge.</p>
            {user ? (
              <Link to="/browse" className="btn primary btn-lg">
                Browse Skills
              </Link>
            ) : (
              <Link to="/register" className="btn primary btn-lg">
                Join Now - It's Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
