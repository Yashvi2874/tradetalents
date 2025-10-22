import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import Header from '../components/Header';
import DashboardHeader from '../components/DashboardHeader';
import SkillsSection from '../components/SkillsSection';
import SearchBar from '../components/SearchBar';
import AddSkillForm from '../components/AddSkillForm';
import './Skills.css';

const Skills = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's skills
  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userAPI.getSkills();
        setMySkills(response.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSkills();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real implementation, you would filter the skills here
  };

  const handleSkillAdded = (newSkill) => {
    setMySkills(prevSkills => [...prevSkills, newSkill]);
  };

  const filteredSkills = mySkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (skill.category && skill.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="skills-page">
      {/* Removed Header since it's now in App.jsx */}
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="skills-container">
        <div className="skills-content">
          <div className="skills-header">
            <h1>My Skills</h1>
          </div>
          
          <AddSkillForm onSkillAdded={handleSkillAdded} />
          
          <div className="search-section">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search your skills..."
            />
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your skills...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <h3>Error Loading Skills</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : (
            <SkillsSection 
              skills={filteredSkills}
              title="Your Skills"
            />
          )}
        </div>
      </div>
      
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Skills;