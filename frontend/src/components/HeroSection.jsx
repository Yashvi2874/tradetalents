import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Canvas } from '@react-three/fiber';
import ThreeBackground from './ThreeBackground';
import './HeroSection.css';

const HeroSection = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="hero-section-container">
      <div className="hero-content-wrapper">
        <div className="hero-grid">
          {/* Left Card */}
          <div className="hero-card">
            <div className="card-content">
              <h1 className="hero-title">
                Unlock Your Potential with <span className="text-primary">Trade Talents</span>
              </h1>
              
              <p className="hero-subtitle">
                Connect with fellow university students to exchange skills, knowledge, and experiences. 
                Learn from the best and become the best.
              </p>
              
              <div className="hero-actions">
                {user ? (
                  <Link to="/dashboard" className="btn primary btn-lg">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn primary btn-lg">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn secondary btn-lg">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              {/* Stats */}
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Students</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Skills Available</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Sessions Completed</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right 3D Elements */}
          <div className="hero-3d-container">
            <div className="visual-wrapper">
              <div className="three-canvas-container">
                <Canvas className="three-canvas" key={theme}>
                  <Suspense fallback={null}>
                    <ThreeBackground />
                  </Suspense>
                </Canvas>
              </div>
              <div className="visual-overlay">
                <h3>Interactive 3D Experience</h3>
                <p>Explore our platform in a whole new dimension</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="floating-element el-1"></div>
      <div className="floating-element el-2"></div>
      <div className="floating-element el-3"></div>
    </div>
  );
};

export default HeroSection;