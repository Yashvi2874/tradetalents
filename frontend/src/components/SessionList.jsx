import React from 'react';
import SessionItem from './SessionItem';
import './SessionList.css';

const SessionList = ({ sessions, title }) => {
  return (
    <div className="session-list card glass">
      <h2 className="section-title">{title}</h2>
      <div className="session-items">
        {sessions && sessions.length > 0 ? (
          sessions.map(session => (
            <SessionItem key={session.id} session={session} />
          ))
        ) : (
          <p className="no-sessions">No sessions found</p>
        )}
      </div>
    </div>
  );
};

export default SessionList;