import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);

  // Sample session data - replace with actual API call
  const sampleSessions = [
    // January 2025 Sessions
    {
      id: 1,
      title: "React Fundamentals",
      tutor: "John Smith",
      date: "2025-09-02",
      time: "10:00 AM",
      duration: "1 hour",
      price: 50,
      description: "Learn the basics of React including components, props, and state management."
    },
    {
      id: 2,
      title: "JavaScript Advanced Concepts",
      tutor: "Sarah Johnson",
      date: "2025-09-02",
      time: "2:00 PM",
      duration: "1.5 hours",
      price: 75,
      description: "Deep dive into closures, promises, async/await, and advanced JavaScript patterns."
    },
    {
      id: 3,
      title: "Python Data Science",
      tutor: "Dr. Emily Rodriguez",
      date: "2025-09-05",
      time: "9:00 AM",
      duration: "2 hours",
      price: 90,
      description: "Introduction to data analysis with pandas, numpy, and matplotlib."
    },
    {
      id: 4,
      title: "CSS Grid & Flexbox",
      tutor: "Mike Davis",
      date: "2025-09-07",
      time: "11:00 AM",
      duration: "2 hours",
      price: 60,
      description: "Master modern CSS layout techniques with Grid and Flexbox."
    },
    {
      id: 5,
      title: "UI/UX Design Principles",
      tutor: "Lisa Chang",
      date: "2025-09-07",
      time: "3:00 PM",
      duration: "1.5 hours",
      price: 70,
      description: "Learn fundamental design principles and user experience best practices."
    },
    {
      id: 6,
      title: "Git & Version Control",
      tutor: "James Wilson",
      date: "2025-09-10",
      time: "1:00 PM",
      duration: "1 hour",
      price: 40,
      description: "Master Git workflows, branching strategies, and collaboration techniques."
    },
    {
      id: 7,
      title: "Docker Containerization",
      tutor: "Ahmed Hassan",
      date: "2025-09-12",
      time: "10:00 AM",
      duration: "2.5 hours",
      price: 95,
      description: "Learn containerization with Docker, from basics to deployment strategies."
    },
    {
      id: 8,
      title: "MongoDB Database Management",
      tutor: "Priya Patel",
      date: "2025-09-14",
      time: "2:30 PM",
      duration: "2 hours",
      price: 80,
      description: "NoSQL database design, CRUD operations, and performance optimization."
    },
    {
      id: 9,
      title: "Vue.js Framework Basics",
      tutor: "Carlos Martinez",
      date: "2025-09-15",
      time: "9:30 AM",
      duration: "1.5 hours",
      price: 65,
      description: "Get started with Vue.js components, directives, and reactive data."
    },
    {
      id: 10,
      title: "Machine Learning Fundamentals",
      tutor: "Dr. Rachel Kim",
      date: "2025-09-17",
      time: "11:00 AM",
      duration: "3 hours",
      price: 120,
      description: "Introduction to ML algorithms, supervised learning, and model evaluation."
    },
    {
      id: 11,
      title: "AWS Cloud Services",
      tutor: "David Thompson",
      date: "2025-09-19",
      time: "10:30 AM",
      duration: "2 hours",
      price: 85,
      description: "Learn EC2, S3, Lambda, and other essential AWS services."
    },
    {
      id: 12,
      title: "Node.js Backend Development",
      tutor: "Emma Wilson",
      date: "2025-09-20",
      time: "3:00 PM",
      duration: "2 hours",
      price: 80,
      description: "Build REST APIs with Node.js, Express, and MongoDB."
    },
    {
      id: 13,
      title: "Cybersecurity Basics",
      tutor: "Mark Anderson",
      date: "2025-09-22",
      time: "1:30 PM",
      duration: "2 hours",
      price: 90,
      description: "Learn about common vulnerabilities, encryption, and security best practices."
    },
    {
      id: 14,
      title: "React Native Mobile Development",
      tutor: "Jennifer Lee",
      date: "2025-09-24",
      time: "10:00 AM",
      duration: "2.5 hours",
      price: 100,
      description: "Build cross-platform mobile apps with React Native."
    },
    {
      id: 15,
      title: "Database Design",
      tutor: "Alex Chen",
      date: "2025-09-25",
      time: "9:00 AM",
      duration: "1 hour",
      price: 55,
      description: "Learn relational database design principles and normalization."
    },
    {
      id: 16,
      title: "GraphQL API Development",
      tutor: "Sophie Turner",
      date: "2025-09-27",
      time: "2:00 PM",
      duration: "2 hours",
      price: 85,
      description: "Modern API development with GraphQL, queries, mutations, and subscriptions."
    },
    {
      id: 17,
      title: "Blockchain Development",
      tutor: "Ryan Cooper",
      date: "2025-09-29",
      time: "11:30 AM",
      duration: "3 hours",
      price: 130,
      description: "Smart contracts, DApps, and blockchain fundamentals."
    },
    {
      id: 18,
      title: "TypeScript Advanced Features",
      tutor: "Nina Petrov",
      date: "2025-09-30",
      time: "4:00 PM",
      duration: "1.5 hours",
      price: 70,
      description: "Advanced TypeScript features: generics, decorators, and type manipulation."
    },
    // December 2024 Sessions
    {
      id: 19,
      title: "Year-End Portfolio Review",
      tutor: "Michael Brown",
      date: "2024-12-02",
      time: "10:00 AM",
      duration: "1 hour",
      price: 45,
      description: "Get feedback on your coding portfolio and prepare for job applications."
    },
    {
      id: 20,
      title: "Holiday Coding Challenge",
      tutor: "Jessica Parker",
      date: "2024-12-05",
      time: "2:30 PM",
      duration: "2 hours",
      price: 60,
      description: "Fun coding challenges with holiday themes to sharpen your problem-solving skills."
    },
    {
      id: 21,
      title: "Web Performance Optimization",
      tutor: "Tom Richardson",
      date: "2024-12-08",
      time: "11:00 AM",
      duration: "2.5 hours",
      price: 85,
      description: "Learn to optimize web applications for speed, SEO, and user experience."
    },
    {
      id: 22,
      title: "API Testing with Postman",
      tutor: "Anna Kowalski",
      date: "2024-12-10",
      time: "1:00 PM",
      duration: "1.5 hours",
      price: 50,
      description: "Master API testing, automation, and documentation with Postman."
    },
    {
      id: 23,
      title: "Microservices Architecture",
      tutor: "Dr. Robert Kim",
      date: "2024-12-12",
      time: "9:30 AM",
      duration: "3 hours",
      price: 110,
      description: "Design and implement scalable microservices with Docker and Kubernetes."
    },
    {
      id: 24,
      title: "Frontend Testing Strategies",
      tutor: "Elena Vasquez",
      date: "2024-12-15",
      time: "3:00 PM",
      duration: "2 hours",
      price: 75,
      description: "Unit testing, integration testing, and E2E testing for React applications."
    },
    {
      id: 25,
      title: "Data Visualization with D3.js",
      tutor: "Kevin Zhang",
      date: "2024-12-17",
      time: "10:30 AM",
      duration: "2.5 hours",
      price: 95,
      description: "Create interactive charts and visualizations using D3.js library."
    },
    {
      id: 26,
      title: "Agile Development Practices",
      tutor: "Sarah Miller",
      date: "2024-12-19",
      time: "2:00 PM",
      duration: "1.5 hours",
      price: 55,
      description: "Learn Scrum, Kanban, and other agile methodologies for team collaboration."
    },
    {
      id: 27,
      title: "Progressive Web Apps (PWA)",
      tutor: "Marcus Johnson",
      date: "2024-12-22",
      time: "11:30 AM",
      duration: "2 hours",
      price: 80,
      description: "Build offline-capable web apps with service workers and app manifests."
    },
    {
      id: 28,
      title: "Code Review Best Practices",
      tutor: "Lisa Anderson",
      date: "2024-12-24",
      time: "4:00 PM",
      duration: "1 hour",
      price: 40,
      description: "Learn effective code review techniques and collaborative development."
    },
    {
      id: 29,
      title: "2025 Tech Trends Preview",
      tutor: "Dr. James Wilson",
      date: "2024-12-28",
      time: "1:30 PM",
      duration: "2 hours",
      price: 65,
      description: "Explore upcoming technology trends and plan your learning roadmap for 2025."
    },
    {
      id: 30,
      title: "New Year Coding Goals",
      tutor: "Rachel Green",
      date: "2024-12-30",
      time: "10:00 AM",
      duration: "1 hour",
      price: 35,
      description: "Set effective coding goals and create a personalized learning plan for the new year."
    }
  ];

  useEffect(() => {
    setSessions(sampleSessions);
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

  return (
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
  );
};

export default Calendar;