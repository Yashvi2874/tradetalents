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
    <section className="features-section py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="features-content flex flex-col lg:flex-row items-center gap-16">
          <div className="section-header text-center lg:text-left lg:w-2/5">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-6">
              Powerful Features
            </h2>
            <p className="section-subtitle text-lg text-gray-600 dark:text-gray-300 mx-auto lg:mx-0 max-w-md">
              Everything you need to connect, learn, and grow with fellow students
            </p>
          </div>
          
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:w-3/5">
            {features.map((feature, index) => (
              <div key={index} className="feature-card h-full">
                <div className="feature-icon text-3xl mb-4"> {feature.icon} </div>
                <h3 className="feature-title text-xl font-bold mb-3"> {feature.title} </h3>
                <p className="feature-description text-gray-600 dark:text-gray-400"> {feature.description} </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;