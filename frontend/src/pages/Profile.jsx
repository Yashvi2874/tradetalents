import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    bio: user?.bio || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating profile:', profileData);
    // Update profile logic would go here
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <h1>My Profile</h1>
            <button 
              className="btn-edit"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="university">University</label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={profileData.university}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              <button type="submit" className="btn-save">Save Changes</button>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name || 'N/A'}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="info-group">
                <span className="info-label">University:</span>
                <span className="info-value">{user?.university || 'N/A'}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Bio:</span>
                <span className="info-value">{user?.bio || 'No bio available.'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Profile;