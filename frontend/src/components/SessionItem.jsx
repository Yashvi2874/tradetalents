import React from 'react';
import { motion } from 'framer-motion';
import './SessionItem.css';

const SessionItem = ({ session }) => {
  const handleAction = () => {
    console.log('Session action:', session);
    // Action logic would go here
  };

  const getActionText = () => {
    switch(session.type) {
      case 'upcoming': return 'Join Session';
      case 'past': return 'View Certificate';
      default: return 'View Details';
    }
  };

  const getStatusClass = () => {
    switch(session.type) {
      case 'upcoming': return 'status-upcoming';
      case 'past': return 'status-past';
      default: return '';
    }
  };

  return (
    <motion.div 
      className="session-item card glass"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="session-header">
        <div className="session-info">
          <h3 className="session-title">{session.title}</h3>
          <p className="session-tutor">with {session.tutor}</p>
        </div>
        <div className={`session-status ${getStatusClass()}`}>
          {session.type}
        </div>
      </div>
      
      <div className="session-details">
        <div className="detail-item">
          <span className="detail-label">📅 Date:</span>
          <span className="detail-value">{session.date}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">🕐 Time:</span>
          <span className="detail-value">{session.time}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">⏱️ Duration:</span>
          <span className="detail-value">{session.duration}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">💎 Price:</span>
          <span className="detail-value">{session.price} credits</span>
        </div>
      </div>
      
      <p className="session-description">{session.description}</p>
      
      <div className="session-actions">
        <button 
          className={`btn ${session.type === 'upcoming' ? 'primary' : 'secondary'}`}
          onClick={handleAction}
        >
          {getActionText()}
        </button>
      </div>
    </motion.div>
  );
};

export default SessionItem;