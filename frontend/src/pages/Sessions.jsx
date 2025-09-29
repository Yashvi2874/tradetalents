import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import DashboardHeader from '../components/DashboardHeader';
import SessionList from '../components/SessionList';
import SearchBar from '../components/SearchBar';
import './Sessions.css';

const Sessions = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const upcomingSessions = [
    { 
      id: 1, 
      title: 'JavaScript Fundamentals', 
      tutor: 'Alex Johnson', 
      date: 'Oct 15, 2025',
      time: '3:00 PM',
      duration: '1 hour',
      price: 25,
      description: 'Learn the basics of JavaScript including variables, functions, and DOM manipulation.',
      type: 'upcoming'
    },
    { 
      id: 2, 
      title: 'Python for Data Science', 
      tutor: 'Sarah Miller', 
      date: 'Oct 17, 2025',
      time: '10:00 AM',
      duration: '2 hours',
      price: 40,
      description: 'Introduction to data analysis with Python using pandas and numpy libraries.',
      type: 'upcoming'
    }
  ];

  const pastSessions = [
    { 
      id: 3, 
      title: 'Introduction to React', 
      tutor: 'Michael Chen', 
      date: 'Sep 20, 2025',
      time: '2:00 PM',
      duration: '1.5 hours',
      price: 30,
      description: 'Learn the fundamentals of React and build your first application.',
      type: 'past'
    },
    { 
      id: 4, 
      title: 'UI/UX Design Principles', 
      tutor: 'Emma Wilson', 
      date: 'Sep 15, 2025',
      time: '4:00 PM',
      duration: '2 hours',
      price: 35,
      description: 'Fundamental principles of user interface and user experience design.',
      type: 'past'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // Search logic would go here
  };

  const handleSessionAction = (session) => {
    if (session.type === 'upcoming') {
      console.log('Joining session:', session);
      // Join session logic would go here
    } else if (session.type === 'past') {
      console.log('Viewing certificate for session:', session);
      // View certificate logic would go here
    }
  };

  return (
    <div className="sessions-page">
      {/* Removed Header since it's now in App.jsx */}
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="sessions-container">
        <div className="sessions-content">
          <div className="sessions-header">
            <h1>My Sessions</h1>
          </div>
          
          <div className="search-section">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search your sessions..."
            />
          </div>
          
          <SessionList 
            sessions={upcomingSessions}
            title="Upcoming Sessions"
            onAction={handleSessionAction}
          />
          
          <SessionList 
            sessions={pastSessions}
            title="Past Sessions"
            onAction={handleSessionAction}
          />
        </div>
      </div>
      
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Sessions;