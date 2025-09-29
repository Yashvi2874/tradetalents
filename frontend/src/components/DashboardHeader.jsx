import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="dashboard-title">
          <h1>Student Dashboard</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user?.name || 'Student'}!</span>
            {user?.credits && (
              <div className="credits-badge">
                <span>Credits: {user.credits}</span>
              </div>
            )}
          </div>
        </div>
        <nav className="dashboard-nav">
          <ul>
            <li><Link to="/dashboard" className="nav-link">Overview</Link></li>
            <li><Link to="/dashboard/sessions" className="nav-link">My Sessions</Link></li>
            <li><Link to="/dashboard/skills" className="nav-link">My Skills</Link></li>
            <li><Link to="/dashboard/profile" className="nav-link">Profile</Link></li>
            <li>
              <button onClick={onLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;