import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sessionAPI } from '../services/sessionService';
import DashboardHeader from '../components/DashboardHeader';
import SearchBar from '../components/SearchBar';
import SessionList from '../components/SessionList';
import './Sessions.css';

const Sessions = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await sessionAPI.getAllSessions();
        setSessions(response.data);
        setFilteredSessions(response.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filter sessions based on search and tab
  useEffect(() => {
    let result = sessions;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      result = result.filter(session => session.status === activeTab);
    }

    setFilteredSessions(result);
  }, [sessions, searchQuery, activeTab]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateSession = () => {
    // Redirect to create session page or show modal
    console.log('Create session clicked');
  };

  if (loading) {
    return (
      <div className="sessions-page">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <div className="sessions-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-page">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <div className="sessions-container">
          <div className="error-container">
            <h3>Error Loading Sessions</h3>
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
    <div className="sessions-page">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="sessions-container">
        <div className="sessions-header">
          <h1>Sessions</h1>
          <button className="btn btn-primary" onClick={handleCreateSession}>
            Create Session
          </button>
        </div>
        
        <div className="sessions-filters">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search sessions..."
          />
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Sessions
            </button>
            <button 
              className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        
        <SessionList sessions={filteredSessions} showStatus={true} />
      </div>
    </div>
  );
};

export default Sessions;