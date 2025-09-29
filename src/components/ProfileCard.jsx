import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-university">{user.university}</p>
          <div className="profile-credits">
            <span className="credits-label">Credits:</span>
            <span className="credits-value">{user.credits || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-value">{user.sessionsTaught || 0}</span>
          <span className="stat-label">Sessions Taught</span>
        </div>
        <div className="stat">
          <span className="stat-value">{user.sessionsLearned || 0}</span>
          <span className="stat-label">Sessions Learned</span>
        </div>
        <div className="stat">
          <span className="stat-value">{user.certificates || 0}</span>
          <span className="stat-label">Certificates</span>
        </div>
      </div>
      
      <div className="profile-bio">
        <h4>About</h4>
        <p>{user.bio || 'No bio available.'}</p>
      </div>
    </div>
  );
};

export default ProfileCard;