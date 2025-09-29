import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="hero-section gradient-bg">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Unlock Your Potential with <span className="text-primary">Trade Talents</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Connect with fellow university students to exchange skills, knowledge, and experiences. 
            Learn from the best and become the best.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="floating-elements">
            <div className="floating-element element-1 float"></div>
            <div className="floating-element element-2 float" style={{ animationDelay: '1s' }}></div>
            <div className="floating-element element-3 float" style={{ animationDelay: '2s' }}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;