import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Chat from '../components/Chat';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Mock data for demonstration
  const statsData = [
    { title: "Upcoming Sessions", value: 3, icon: "📅", color: "#3b82f6" },
    { title: "Credits Balance", value: user?.credits || 125, icon: "💎", color: "#8b5cf6" },
    { title: "Skills Taught", value: 5, icon: "🎓", color: "#10b981" },
    { title: "Certificates", value: 3, icon: "🏆", color: "#f59e0b" }
  ];

  const upcomingSessions = [
    { 
      id: 1, 
      title: 'JavaScript Fundamentals', 
      tutor: 'Alex Johnson', 
      date: 'Oct 15, 2025',
      time: '3:00 PM',
      duration: '1 hour',
      price: 25,
      type: 'learning'
    },
    { 
      id: 2, 
      title: 'Python for Data Science', 
      tutor: 'Sarah Miller', 
      date: 'Oct 17, 2025',
      time: '10:00 AM',
      duration: '2 hours',
      price: 40,
      type: 'learning'
    },
    { 
      id: 3, 
      title: 'Advanced React Patterns', 
      tutor: 'You (Michael Chen)', 
      date: 'Oct 20, 2025',
      time: '2:00 PM',
      duration: '1.5 hours',
      price: 35,
      type: 'teaching'
    }
  ];

  const mySkills = [
    { name: 'Web Development', level: 'Advanced', role: 'Teaching' },
    { name: 'UI/UX Design', level: 'Intermediate', role: 'Learning' },
    { name: 'Python Programming', level: 'Beginner', role: 'Learning' }
  ];

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <p className="header-subtitle">Welcome back, {user?.name || 'User'}! Here's what's happening today.</p>
          </div>
          <div className="user-info">
            <div className="credits-badge">
              <span className="credits-icon">💎</span>
              <span className="credits-value">{user?.credits || 0} Credits</span>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            My Sessions
          </button>
          <button 
            className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            My Skills
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">{stat.title}</h3>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-actions">
              <Link to="/browse" className="btn btn-primary">
                <span className="btn-icon">🔍</span>
                Browse Skills
              </Link>
              <Link to="/messages" className="btn btn-secondary">
                <span className="btn-icon">💬</span>
                View Messages
              </Link>
              <button className="btn btn-secondary" onClick={toggleChat}>
                <span className="btn-icon">💬</span>
                Open Chat
              </button>
            </div>

            <div className="upcoming-sessions">
              <div className="section-header">
                <h2>Upcoming Sessions</h2>
                <Link to="/dashboard/sessions" className="view-all-link">View All</Link>
              </div>
              <div className="sessions-list">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="session-card">
                    <div className="session-header">
                      <h3 className="session-title">{session.title}</h3>
                      <div className={`session-type ${session.type}`}>
                        {session.type === 'learning' ? 'Learning' : 'Teaching'}
                      </div>
                    </div>
                    <div className="session-details">
                      <div className="session-info">
                        <span className="session-label">Tutor</span>
                        <span className="session-value">{session.tutor}</span>
                      </div>
                      <div className="session-info">
                        <span className="session-label">Date & Time</span>
                        <span className="session-value">{session.date} at {session.time}</span>
                      </div>
                      <div className="session-info">
                        <span className="session-label">Duration</span>
                        <span className="session-value">{session.duration}</span>
                      </div>
                      <div className="session-info">
                        <span className="session-label">Price</span>
                        <span className="session-value">{session.price} credits</span>
                      </div>
                    </div>
                    <div className="session-actions">
                      <button className="btn btn-primary" onClick={toggleChat}>
                        {session.type === 'learning' ? 'Join Session' : 'Manage Session'}
                      </button>
                      <Link to="/messages" className="btn btn-secondary">
                        View Messages
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>My Sessions</h2>
              <div className="section-actions">
                <button className="btn btn-primary">Create Session</button>
              </div>
            </div>
            <div className="session-filters">
              <button className="filter-btn active">All Sessions</button>
              <button className="filter-btn">Learning</button>
              <button className="filter-btn">Teaching</button>
              <button className="filter-btn">Completed</button>
            </div>
            
            <div className="sessions-list">
              {upcomingSessions.map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <h3 className="session-title">{session.title}</h3>
                    <div className={`session-type ${session.type}`}>
                      {session.type === 'learning' ? 'Learning' : 'Teaching'}
                    </div>
                  </div>
                  <div className="session-details">
                    <div className="session-info">
                      <span className="session-label">Tutor</span>
                      <span className="session-value">{session.tutor}</span>
                    </div>
                    <div className="session-info">
                      <span className="session-label">Date & Time</span>
                      <span className="session-value">{session.date} at {session.time}</span>
                    </div>
                    <div className="session-info">
                      <span className="session-label">Duration</span>
                      <span className="session-value">{session.duration}</span>
                    </div>
                    <div className="session-info">
                      <span className="session-label">Price</span>
                      <span className="session-value">{session.price} credits</span>
                    </div>
                  </div>
                  <div className="session-actions">
                    <button className="btn btn-primary" onClick={toggleChat}>
                      {session.type === 'learning' ? 'Join Session' : 'Manage Session'}
                    </button>
                    <Link to="/messages" className="btn btn-secondary">
                      View Messages
                    </Link>
                    <button className="btn btn-secondary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>My Skills</h2>
              <div className="section-actions">
                <button className="btn btn-primary">Add New Skill</button>
              </div>
            </div>
            
            <div className="skills-grid">
              {mySkills.map((skill, index) => (
                <div key={index} className="skill-card">
                  <div className="skill-header">
                    <h3 className="skill-name">{skill.name}</h3>
                    <span className={`skill-role-badge ${skill.role.toLowerCase()}`}>
                      {skill.role}
                    </span>
                  </div>
                  <div className="skill-info">
                    <div className="skill-level">
                      <span className="level-label">Level:</span>
                      <span className="level-value">{skill.level}</span>
                    </div>
                    <div className="skill-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '60%' : '30%',
                            backgroundColor: skill.level === 'Advanced' ? '#10b981' : skill.level === 'Intermediate' ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="skill-actions">
                    <button className="btn btn-secondary">View Progress</button>
                    {skill.role === 'Teaching' && (
                      <button className="btn btn-primary">Create Session</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isChatOpen && (
        <div className="chat-overlay">
          <Chat 
            sessionId="JS101" 
            sessionTitle="JavaScript Fundamentals" 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
          <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>×</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;