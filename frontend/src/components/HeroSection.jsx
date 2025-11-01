import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HeroSection.css';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="hero-bg-blob blob-1" />
      <div className="hero-bg-blob blob-2" />
      <div className="hero-bg-blob blob-3" />

      <div className="container">
        <div
          className="hero-card"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            e.currentTarget.style.setProperty('--mx', `${x}px`);
            e.currentTarget.style.setProperty('--my', `${y}px`);
            const rx = ((y / r.height) - 0.5) * -6; // tilt
            const ry = ((x / r.width) - 0.5) * 6;
            e.currentTarget.style.setProperty('--rx', `${rx}deg`);
            e.currentTarget.style.setProperty('--ry', `${ry}deg`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.removeProperty('--rx');
            e.currentTarget.style.removeProperty('--ry');
          }}
        >
          <div className="card-content">
            <h1 className="hero-title">
              Unlock Your Potential <br />
              <span>with Trade Talents</span>
            </h1>

            <p className="hero-subtitle">
              Connect with fellow university students to exchange skills, knowledge, and experiences.
              Learn from the best and become the best.
            </p>

            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                  <Link to="/login" className="btn btn-ghost">Sign In</Link>
                </>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-k">10K+</div>
                <div className="stat-v">Active Students</div>
              </div>
              <div className="stat">
                <div className="stat-k">500+</div>
                <div className="stat-v">Skills Available</div>
              </div>
              <div className="stat">
                <div className="stat-k">50K+</div>
                <div className="stat-v">Sessions Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;