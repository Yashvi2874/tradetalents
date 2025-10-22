import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sessionAPI } from '../services/sessionService';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import './Calendar.css';

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Use import.meta.env for Vite applications instead of process.env
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    // Listen for calendar updates
    newSocket.on('calendar-updated', (data) => {
      console.log('Calendar updated:', data);
      // Refresh sessions when a new session is created
      fetchSessions();
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Fetch real session data from backend
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await sessionAPI.getAllSessions();
      
      // Transform session data to match calendar format
      const calendarSessions = response.data.map(session => ({
        id: session._id,
        title: session.title,
        tutor: session.tutor?.name || 'Unknown Tutor',
        date: new Date(session.startTime).toISOString().split('T')[0],
        time: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: '1 hour', // This could be calculated from start/end times
        price: session.price,
        description: session.description,
        status: session.status
      }));
      
      setSessions(calendarSessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getSessionsForDate = (date) => {
    const dateStr = formatDateForComparison(date);
    return sessions.filter(session => session.date === dateStr);
  };

  const getSelectedDateSessions = () => {
    return getSessionsForDate(selectedDate);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    const todayStr = formatDateForComparison(today);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDateForComparison(date);
      const isToday = dateStr === todayStr;
      const isSelected = formatDateForComparison(selectedDate) === dateStr;
      const hasSessions = getSessionsForDate(date).length > 0;

      days.push(
        <motion.div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasSessions ? 'has-sessions' : ''}`}
          onClick={() => handleDateClick(day)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="day-number">{day}</span>
          {hasSessions && <div className="session-indicator"></div>}
        </motion.div>
      );
    }

    return days;
  };

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="calendar-page">
        <div className="calendar-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-page">
        <div className="calendar-container">
          <div className="error-container">
            <h3>Error Loading Calendar</h3>
            <p>{error}</p>
            <button className="btn primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <motion.div 
          className="calendar-section card glass"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="calendar-header">
            <div className="calendar-nav">
              <motion.button 
                onClick={() => navigateMonth(-1)} 
                className="nav-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &#8249;
              </motion.button>
              <h2 className="calendar-title">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <motion.button 
                onClick={() => navigateMonth(1)} 
                className="nav-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &#8250;
              </motion.button>
            </div>
            <motion.button 
              onClick={navigateToToday} 
              className="today-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-header-row">
              {dayNames.map(day => (
                <div key={day} className="calendar-header-cell">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-body">
              {renderCalendarDays()}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="sessions-section card glass"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sessions-header">
            <h3 className="sessions-title">
              Sessions for {formatSelectedDate()}
            </h3>
          </div>
          
          <div className="sessions-list">
            {getSelectedDateSessions().length > 0 ? (
              getSelectedDateSessions().map((session, index) => (
                <motion.div 
                  key={session.id} 
                  className="session-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="session-header">
                    <h4 className="session-title">{session.title}</h4>
                    <div className="session-price">{session.price} credits</div>
                  </div>
                  <div className="session-details">
                    <div className="session-detail">
                      <span className="label">👨‍🏫 Tutor:</span> {session.tutor}
                    </div>
                    <div className="session-detail">
                      <span className="label">🕐 Time:</span> {session.time}
                    </div>
                    <div className="session-detail">
                      <span className="label">⏱️ Duration:</span> {session.duration}
                    </div>
                    {session.status && (
                      <div className="session-detail">
                        <span className="label">📊 Status:</span> 
                        <span className={`status-badge status-${session.status}`}>
                          {session.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="session-description">
                    {session.description}
                  </div>
                  <div className="session-actions">
                    <motion.button 
                      className="btn primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Session
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="no-sessions">
                <div className="no-sessions-icon">📅</div>
                <p>No sessions scheduled for this date</p>
                <p className="no-sessions-hint">Try selecting a different date to see available sessions</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;