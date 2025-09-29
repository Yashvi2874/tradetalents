import React from 'react';
import './SessionCard.css';

const SessionCard = ({ session, onBook }) => {
  return (
    <div className="session-card">
      <div className="session-header">
        <h3 className="session-title">{session.title}</h3>
        <div className="session-price">{session.price} credits</div>
      </div>
      <div className="session-details">
        <div className="session-tutor">
          <span className="label">Tutor:</span> {session.tutor}
        </div>
        <div className="session-date">
          <span className="label">Date:</span> {session.date}
        </div>
        <div className="session-time">
          <span className="label">Time:</span> {session.time}
        </div>
        <div className="session-duration">
          <span className="label">Duration:</span> {session.duration}
        </div>
      </div>
      <div className="session-description">
        {session.description}
      </div>
      <div className="session-actions">
        <button 
          className="btn primary"
          onClick={() => onBook && onBook(session)}
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default SessionCard;