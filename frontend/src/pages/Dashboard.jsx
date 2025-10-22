import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, sessionAPI } from '../services/api';
import { skillAPI } from '../services/skillService';
import StatsCard from '../components/StatsCard';
import SessionList from '../components/SessionList';
import SkillsSection from '../components/SkillsSection';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    credits: 0,
    skills: 0,
    sessions: 0,
    upcoming: 0
  });
  const [sessions, setSessions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile to get credits
        const profileResponse = await userAPI.getProfile();
        
        // Fetch user skills
        const skillsResponse = await userAPI.getSkills();
        
        // Fetch user sessions
        const sessionsResponse = await sessionAPI.getAll();

        // Update state
        setStats({
          credits: profileResponse.data.credits || 0,
          skills: skillsResponse.data.length || 0,
          sessions: sessionsResponse.data.length || 0,
          upcoming: sessionsResponse.data.filter(session => 
            session.status === 'upcoming'
          ).length || 0
        });

        setSkills(skillsResponse.data);
        setSessions(sessionsResponse.data);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAllSkills = () => {
    navigate('/browse');
  };

  const handleViewAllSessions = () => {
    navigate('/calendar');
  };

  const handleBrowseSkills = () => {
    navigate('/browse');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="error-container">
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <div className="user-welcome">
              <span>Welcome back, {user?.name || 'User'}!</span>
              <div className="credits-badge">
                <span>{stats.credits} Credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <StatsCard 
            title="Credits" 
            value={stats.credits} 
            icon="💰" 
            color="blue"
          />
          <StatsCard 
            title="My Skills" 
            value={stats.skills} 
            icon="💡" 
            color="green"
          />
          <StatsCard 
            title="Total Sessions" 
            value={stats.sessions} 
            icon="📅" 
            color="purple"
          />
          <StatsCard 
            title="Upcoming" 
            value={stats.upcoming} 
            icon="⏰" 
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-card" onClick={handleBrowseSkills}>
              <span className="action-icon">🔍</span>
              <span className="action-title">Browse Skills</span>
              <span className="action-desc">Discover new skills to learn</span>
            </button>
            <button className="action-card" onClick={() => navigate('/credits')}>
              <span className="action-icon">💳</span>
              <span className="action-title">Buy Credits</span>
              <span className="action-desc">Get more credits for sessions</span>
            </button>
            <button className="action-card" onClick={() => navigate('/messages')}>
              <span className="action-icon">💬</span>
              <span className="action-title">Messages</span>
              <span className="action-desc">Chat with tutors and students</span>
            </button>
            <button className="action-card" onClick={() => navigate('/calendar')}>
              <span className="action-icon">🗓️</span>
              <span className="action-title">Calendar</span>
              <span className="action-desc">View your upcoming sessions</span>
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Sessions</h2>
            <button className="view-all-btn" onClick={handleViewAllSessions}>
              View All
            </button>
          </div>
          <SessionList 
            sessions={sessions.slice(0, 3)} 
            showStatus={true}
          />
        </div>

        {/* My Skills */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Skills</h2>
            <button className="view-all-btn" onClick={handleViewAllSkills}>
              View All
            </button>
          </div>
          <SkillsSection 
            skills={skills.slice(0, 4)} 
            title=""
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;