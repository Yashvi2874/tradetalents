import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="howit">
      <div className="howit__wrap">
        <header className="howit__head">
          <h2>How It Works</h2>
          <p>Start your peer-learning journey in just a few simple steps</p>
          <span className="howit__underline" />
        </header>

        <ol className="howit__list">
          {[
            { icon: '📝', title: 'Sign Up', desc: 'Create your account and verify your university status to join our community of learners.' },
            { icon: '🔎', title: 'Find or Offer Skills', desc: 'Browse sessions or create your own skill offering based on your expertise.' },
            { icon: '🤝', title: 'Connect & Learn', desc: 'Attend sessions and interact with peers through chat and collaborative tools.' },
            { icon: '⭐', title: 'Earn Credits', desc: 'Teach to earn credits and spend them on learning new skills.' }
          ].map((s, i) => (
            <li key={s.title} className="howit__item">
              <div className="howit__dot" aria-hidden="true">{i+1}</div>
              <div className="howit__card" role="group" aria-labelledby={`howit-${i}`}>
                <div className="howit__icon" aria-hidden="true">{s.icon}</div>
                <h3 id={`howit-${i}`} className="howit__title">{s.title}</h3>
                <p className="howit__desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;