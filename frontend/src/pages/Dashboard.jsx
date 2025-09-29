import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
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
      <DashboardHeader user={user} />
      
      <div className="dashboard-container">
        {/* Stats Section */}
        <motion.section 
          className="stats-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <SessionList 
                sessions={upcomingSessions}
                title="Upcoming Sessions"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <SkillsSection 
                skills={mySkills}
                title="My Skills"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;