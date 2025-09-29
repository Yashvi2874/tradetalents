import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Learn and Teach Practical Skills with University Peers</h1>
          <p className="hero-description">
            Trade Talents is a peer-learning platform where verified university students can teach and learn practical skills from one another.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">Get Started - It's Free</Link>
            <Link to="/login" className="btn btn-secondary">Login to Your Account</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Skill Sessions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Universities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;