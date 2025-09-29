import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your account and verify your university status to join our community of learners."
    },
    {
      number: "2",
      title: "Find or Offer Skills",
      description: "Browse available sessions or create your own skill offerings based on your expertise."
    },
    {
      number: "3",
      title: "Connect & Learn",
      description: "Attend sessions and interact with peers through real-time chat and collaborative tools."
    },
    {
      number: "4",
      title: "Earn Credits",
      description: "Gain credits for teaching and use them to learn new skills - build your knowledge portfolio."
    }
  ];

  return (
    <section className="how-it-works" data-aos="fade-up">
      <div className="container">
        <div className="section-header" data-aos="fade-up" data-aos-delay="50">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Start your peer-learning journey in just a few simple steps</p>
        </div>
        <div className="steps-container">
          <div className="steps">
            {steps.map((step, index) => (
              <div
                key={index}
                className="step"
                data-aos="flip-up"
                data-aos-delay={String(100 * (index + 1))}
              >
                <div className="step-number">
                  <span>{step.number}</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
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
