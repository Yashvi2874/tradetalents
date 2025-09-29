import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      title: "Skill-Based Sessions",
      description: "Book sessions based on specific skills you want to learn or teach with verified university peers.",
      icon: "🎓"
    },
    {
      title: "Real-Time Chat",
      description: "Connect instantly with peers through our integrated messaging system during sessions.",
      icon: "💬"
    },
    {
      title: "Certificate Generation",
      description: "Earn verified certificates for completed sessions to showcase your newly acquired skills.",
      icon: "🏆"
    },
    {
      title: "Credit Exchange",
      description: "Participate in our gamification system - earn credits for teaching and spend them on learning.",
      icon: "💎"
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Trade Talents?</h2>
          <p className="section-subtitle">A better way to learn and share knowledge with your university community</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <span className="icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;