import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { sessionAPI } from '../services/sessionService';
import io from 'socket.io-client';
import './BrowseSkills.css';

const BrowseSkills = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Use import.meta.env for Vite applications instead of process.env
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // State for sessions
  const [sessions, setSessions] = useState([]);

  // Fetch sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await sessionAPI.getAllSessions();
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Handle join session
  const handleJoinSession = async (session) => {
    try {
      const response = await sessionAPI.joinSession(session._id);
      
      if (response.data) {
        // Emit real-time update if socket is available
        if (socket) {
          socket.emit('session-joined', {
            session: response.data,
            userId: user._id
          });
        }
        
        alert(`Successfully joined session: ${session.title}`);
        navigate('/calendar');
      }
    } catch (err) {
      console.error('Error joining session:', err);
      alert('Failed to join session. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="browse-skills">
        <div className="browse-skills-container">
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
      <div className="browse-skills">
        <div className="browse-skills-container">
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
    <div className="browse-skills">
      <div className="browse-skills-container">
        <motion.div 
          className="browse-skills-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Available Sessions</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user?.name || 'User'}!</span>
            <div className="credits-badge">
              <span>{user?.credits || 0} Credits</span>
            </div>
          </div>
        </motion.div>

        {/* Sessions Display - Render directly on page */}
        {sessions && sessions.length > 0 ? (
          <div className="sessions-grid">
            {sessions.map((session, index) => (
              <motion.div
                key={session._id}
                className={`session-card session-card-${index % 5}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="session-header">
                  <h3 className="session-title">{session.title}</h3>
                  <div className="session-price">{session.price} credits</div>
                </div>
                
                <p className="session-description">{session.description}</p>
                
                <div className="session-time">
                  <div className="time-item">
                    <span className="time-label">Starts:</span>
                    <span className="time-value">{new Date(session.startTime).toLocaleString()}</span>
                  </div>
                  <div className="time-item">
                    <span className="time-label">Ends:</span>
                    <span className="time-value">{new Date(session.endTime).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="session-status">
                  <span className="spots-left">
                    {session.maxStudents - (session.students?.length || 0)} spots left
                  </span>
                </div>
                
                <div className="session-actions">
                  <button 
                    className="join-btn"
                    onClick={() => handleJoinSession(session)}
                  >
                    Join Session
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No sessions available</h3>
            <p>Check back later for upcoming sessions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseSkills;