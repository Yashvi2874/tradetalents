import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sessionAPI } from '../services/sessionService';
import { skillAPI } from '../services/skillService';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import './Calendar.css';

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    title: '',
    description: '',
    date: '', // Will be set when booking form is opened
    time: '',
    duration: 60,
    price: 10,
    meetLink: '',
    skillIds: []
  });

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
      
      // Transform session data to match calendar format with proper timezone handling
      const calendarSessions = response.data.map(session => {
        const startDate = new Date(session.startTime);
        const endDate = new Date(session.endTime);
        
        // Use local date instead of UTC to match the user's timezone
        const localDateStr = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
        
        return {
          id: session._id,
          title: session.title,
          tutor: session.tutor?.name || 'Unknown Tutor',
          date: localDateStr, // Use local date for consistency
          time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: Math.round((endDate - startDate) / (1000 * 60)), // in minutes
          price: session.price,
          description: session.description,
          status: session.status,
          meetLink: session.meetLink
        };
      });
      
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

  // Fetch skills for the dropdown
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillAPI.getAllSkills();
        setSkills(response.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };

    fetchSkills();
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
    // Use local date for consistency in comparisons
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
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
    // Create date in local timezone but ensure consistent handling
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

  // Handle booking form input changes
  const handleBookingInputChange = (e) => {
    const { name, value, options, multiple } = e.target;
    
    if (name === 'skillIds' && multiple) {
      // Handle multiple skill selection
      const selectedSkillIds = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      
      setBookingData(prev => ({
        ...prev,
        skillIds: selectedSkillIds
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Combine date and time for startTime using local timezone
      const [year, month, day] = bookingData.date.split('-').map(Number);
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      const startTime = new Date(year, month - 1, day, hours, minutes); // month is 0-indexed
      const endTime = new Date(startTime.getTime() + bookingData.duration * 60000); // Add duration in milliseconds
      
      // Validate that we have all required data
      if (!bookingData.title || !bookingData.description || !bookingData.date || !bookingData.time) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate that endTime is after startTime
      if (startTime >= endTime) {
        alert('End time must be after start time');
        return;
      }
      
      const sessionData = {
        title: bookingData.title,
        description: bookingData.description,
        startTime: startTime.toISOString(), // This will convert to UTC for storage
        endTime: endTime.toISOString(), // This will convert to UTC for storage
        price: parseInt(bookingData.price) || 10,
        maxStudents: 10,
        meetLink: bookingData.meetLink || undefined,
        skillIds: bookingData.skillIds.length > 0 ? bookingData.skillIds : undefined // Send skillIds array if available
      };
      
      console.log('Sending session data:', sessionData);
      
      // Create session
      const response = await sessionAPI.createSession(sessionData);
      
      // Emit event to update calendar for other users
      if (socket) {
        socket.emit('session-created', {
          session: { ...sessionData, _id: Date.now() }, // Mock ID for real-time update
          userId: user._id
        });
      }
      
      // Refresh sessions
      fetchSessions();
      
      // Close form and reset
      setShowBookingForm(false);
      setBookingData({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        price: 10,
        meetLink: '',
        skillIds: []
      });

      // Show success message
      alert('Session booked successfully!');
    } catch (err) {
      console.error('Error booking session:', err);
      let errorMessage = 'Failed to book session. Please try again.';
      
      // Try to get more specific error message
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error: ${errorMessage}`);
    }
  };

  // Handle book session button click
  const handleBookSessionClick = () => {
    // Pre-fill the date with the selected date in YYYY-MM-DD format using local timezone
    const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    
    setBookingData(prev => ({
      ...prev,
      date: localDateStr
    }));
    setShowBookingForm(true);
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
          
          {/* Booking Form */}
          {showBookingForm ? (
            <div className="booking-form">
              <h3>Book New Session</h3>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={bookingData.title}
                    onChange={handleBookingInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={bookingData.description}
                    onChange={handleBookingInputChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={bookingData.date}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Time:</label>
                    <input
                      type="time"
                      name="time"
                      value={bookingData.time}
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (minutes):</label>
                    <select
                      name="duration"
                      value={bookingData.duration}
                      onChange={handleBookingInputChange}
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Price (credits):</label>
                    <input
                      type="number"
                      name="price"
                      value={bookingData.price}
                      onChange={handleBookingInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Meeting Link (Optional):</label>
                  <input
                    type="text"
                    name="meetLink"
                    value={bookingData.meetLink}
                    onChange={handleBookingInputChange}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  />
                </div>
                
                <div className="form-group">
                  <label>Associated Skills (Optional):</label>
                  <select
                    name="skillIds"
                    value={bookingData.skillIds}
                    onChange={handleBookingInputChange}
                    multiple
                    style={{ height: '150px' }}
                  >
                    {skills.map((skill) => (
                      <option key={skill._id} value={skill._id}>
                        {skill.name} - {skill.tutor?.name || 'Unknown Tutor'}
                      </option>
                    ))}
                  </select>
                  <small>Hold Ctrl (Cmd on Mac) to select multiple skills</small>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn secondary" onClick={() => setShowBookingForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary">
                    Book Session
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="sessions-list">
              <div className="session-actions" style={{ marginBottom: '1rem' }}>
                <motion.button 
                  className="btn primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookSessionClick}
                >
                  + Book New Session
                </motion.button>
              </div>
              
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
                        <span className="label">⏱️ Duration:</span> {session.duration} minutes
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
                      {session.meetLink ? (
                        <motion.button 
                          className="btn join-session"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(session.meetLink, '_blank')}
                        >
                          Join Session
                        </motion.button>
                      ) : (
                        <motion.button 
                          className="btn join-session"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => alert('Meeting link will be available soon')}
                        >
                          Join Session
                        </motion.button>
                      )}
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;