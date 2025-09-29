import React from 'react';
import './SessionItem.css';

const SessionItem = ({ session, onAction }) => {
  const handleAction = () => {
    if (onAction) {
      onAction(session);
    }
  };

  return (
    <div className="session-item">
      <div className="session-header">
        <h3 className="session-title">{session.title}</h3>
        <div className="session-price">{session.price} credits</div>
      </div>
      <div className="session-details">
        <div className="session-info">
          <span className="info-label">Tutor</span>
          <span className="info-value">{session.tutor}</span>
        </div>
        <div className="session-info">
          <span className="info-label">Date</span>
          <span className="info-value">{session.date}</span>
        </div>
        <div className="session-info">
          <span className="info-label">Time</span>
          <span className="info-value">{session.time}</span>
        </div>
        <div className="session-info">
          <span className="info-label">Duration</span>
          <span className="info-value">{session.duration}</span>
        </div>
      </div>
      <div className="session-description">
        {session.description}
      </div>
      <div className="session-actions">
        <button 
          className={`btn ${session.type === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={handleAction}
        >
          {session.type === 'upcoming' ? 'Join Session' : 'Book Session'}
        </button>
      </div>
    </div>
  );
};

export default SessionItem;