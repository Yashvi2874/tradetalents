import React from 'react';
import './FeaturesSection.css';

const features = [
  {
    title: "Skill Exchange",
    description: "Connect with students to exchange skills and knowledge in a collaborative environment.",
    icon: "🔄"
  },
  {
    title: "Real-time Messaging",
    description: "Communicate instantly with your learning partners through our integrated chat system.",
    icon: "💬"
  },
  {
    title: "Session Management",
    description: "Create, join, and manage learning sessions with ease.",
    icon: "📚"
  },
  {
    title: "Profile Showcase",
    description: "Build your academic profile and showcase your talents to the community.",
    icon: "👤"
  },
  {
    title: "Credit System",
    description: "Earn credits for teaching and spend them on learning new skills.",
    icon: "⭐"
  },
  {
    title: "University Network",
    description: "Connect with peers from your university and beyond.",
    icon: "🎓"
  }
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to connect, learn, and grow with fellow students
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
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