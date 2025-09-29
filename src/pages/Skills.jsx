import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import DashboardHeader from '../components/DashboardHeader';
import SkillsSection from '../components/SkillsSection';
import SearchBar from '../components/SearchBar';
import './Skills.css';

const Skills = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mySkills = [
    { name: 'Web Development', level: 'Advanced' },
    { name: 'UI/UX Design', level: 'Intermediate' },
    { name: 'Python Programming', level: 'Beginner' },
    { name: 'Data Analysis', level: 'Intermediate' }
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

  const handleAddSkill = (skill) => {
    console.log('Adding skill:', skill);
    // Add skill logic would go here
  };

  return (
    <div className="skills-page">
      {/* Removed Header since it's now in App.jsx */}
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="skills-container">
        <div className="skills-content">
          <div className="skills-header">
            <h1>My Skills</h1>
          </div>
          
          <div className="search-section">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search your skills..."
            />
          </div>
          
          <SkillsSection 
            skills={mySkills}
            onAddSkill={handleAddSkill}
          />
        </div>
      </div>
      
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Skills;