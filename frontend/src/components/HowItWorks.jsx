import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your account and verify your university status to join our community of learners.",
      icon: "📝"
    },
    {
      number: "2",
      title: "Find or Offer Skills",
      description: "Browse available sessions or create your own skill offerings based on your expertise.",
      icon: "🔍"
    },
    {
      number: "3",
      title: "Connect & Learn",
      description: "Attend sessions and interact with peers through real-time chat and collaborative tools.",
      icon: "🤝"
    },
    {
      number: "4",
      title: "Earn Credits",
      description: "Gain credits for teaching and use them to learn new skills - build your knowledge portfolio.",
      icon: "⭐"
    }
  ];

  return (
    <section className="how-it-works py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16" data-aos="fade-up" data-aos-delay="50">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="section-subtitle text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start your peer-learning journey in just a few simple steps
          </p>
        </div>
        <div className="steps-container">
          <div className="steps grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="step bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                data-aos="flip-up"
                data-aos-delay={String(100 * (index + 1))}
              >
                <div className="step-number flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  {step.icon}
                </div>
                <div className="step-content">
                  <h3 className="step-title text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="step-description text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;