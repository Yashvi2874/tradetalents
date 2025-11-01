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
    <section className="how-it-works py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="how-it-works-content flex flex-col lg:flex-row items-center gap-16">
          <div className="section-header text-center lg:text-left lg:w-2/5">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-6">
              How It Works
            </h2>
            <p className="section-subtitle text-lg text-gray-600 dark:text-gray-300 mx-auto lg:mx-0 max-w-md">
              Start your peer-learning journey in just a few simple steps
            </p>
          </div>
          
          <div className="steps-container lg:w-3/5">
            <div className="steps grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="step flex flex-col items-center text-center h-full"
                >
                  <div className="step-number w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="step-content w-full">
                    <h3 className="step-title text-xl font-bold mb-3">
                      {step.title}
                    </h3>
                    <p className="step-description text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;