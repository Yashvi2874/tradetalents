import React from 'react';
import SessionItem from './SessionItem';
import './SessionList.css';

const SessionList = ({ sessions, title, onAction }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="session-list">
        <h2 className="session-list-title">{title}</h2>
        <div className="no-sessions">
          <p>No sessions available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-list">
      <h2 className="session-list-title">{title}</h2>
      <div className="sessions">
        {sessions.map(session => (
          <SessionItem 
            key={session.id} 
            session={session} 
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionList;