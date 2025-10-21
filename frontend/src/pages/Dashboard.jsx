import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/StatsCard';
import SessionList from '../components/SessionList';
import SkillsSection from '../components/SkillsSection';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const stats = [
    { title: 'Total Sessions', value: 12, change: '+2 this month', icon: '📅' },
    { title: 'Skills Mastered', value: 8, change: '+1 this month', icon: '🧠' },
    { title: 'Credits', value: user?.credits || 100, change: '+25 this week', icon: '💎' },
    { title: 'Community Rank', value: '#42', change: 'Top 10%', icon: '🏆' }
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

  const mySkills = [
    { name: 'Web Development', level: 'Advanced' },
    { name: 'UI/UX Design', level: 'Intermediate' },
    { name: 'Python Programming', level: 'Beginner' },
    { name: 'Data Analysis', level: 'Intermediate' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <motion.section 
          className="welcome-section card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="welcome-title">
            Welcome back, <span className="welcome-highlight">{user?.name || 'User'}</span>!
          </h1>
          <p className="welcome-subtitle">
            Ready to learn something new today? Let's get started!
          </p>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="stats-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
              >
                <StatsCard 
                  title={stat.title} 
                  value={stat.value} 
                  change={stat.change} 
                  icon={stat.icon} 
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Sessions and Skills Section */}
        <div className="dashboard-content">
          <div className="content-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="content-section">
                <h3>Upcoming Sessions</h3>
                <SessionList 
                  sessions={upcomingSessions}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="content-section">
                <h3>My Skills</h3>
                <SkillsSection 
                  skills={mySkills}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;