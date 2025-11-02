import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { skillAPI } from '../services/skillService';
import { sessionAPI } from '../services/sessionService';
import io from 'socket.io-client';
import './BrowseSkills.css';

const BrowseSkills = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const categories = ['all', 'Programming', 'Data Science', 'Design', 'Business', 'Creative'];

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

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (sortBy) {
          params.sortBy = sortBy;
        }
        
        const response = await skillAPI.getAllSkills(params);
        setSkills(response.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [searchTerm, selectedCategory, sortBy]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle view details - navigate to skill details page
  const handleViewDetails = (skillId) => {
    navigate(`/skills/${skillId}`);
  };

  // Handle book session with real-time calendar update
  const handleBookSession = async (skill) => {
    try {
      // Create a session for this skill
      const sessionData = {
        title: `Session for ${skill.name}`,
        description: `Learning session for ${skill.name}`,
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 86400000 + 3600000), // 1 hour session
        price: skill.price,
        maxStudents: 10,
        skillId: skill._id
      };
      
      const response = await sessionAPI.createSession(sessionData);
      
      if (response.data) {
        // Emit real-time update to calendar
        if (socket) {
          socket.emit('session-created', {
            session: response.data,
            userId: user._id
          });
        }
        
        // Navigate to calendar to see the new session
        alert(`Session booked successfully for ${skill.name}! Check your calendar.`);
        navigate('/calendar');
      }
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session. Please try again.');
    }
  };

  // Handle chat with tutor - navigate to chat with tutor context
  const handleChatWithTutor = (skill) => {
    // Navigate to messages with tutor context
    navigate('/messages', { 
      state: { 
        tutorId: skill.tutor?._id,
        tutorName: skill.tutor?.name,
        skillId: skill._id,
        skillName: skill.name
      } 
    });
  };

  if (loading) {
    return (
      <div className="browse-skills">
        <div className="browse-skills-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading skills...</p>
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
            <h3>Error Loading Skills</h3>
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
          <h1>Browse Skills</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user?.name || 'User'}!</span>
            <div className="credits-badge">
              <span>{user?.credits || 0} Credits</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="browse-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search skills, tutors, or tags..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sort-filter">
            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          className="skills-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                className="skill-card card glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="skill-header">
                  <h3 className="skill-name">{skill.name}</h3>
                  <div className="skill-price">{skill.price} credits</div>
                </div>
                
                <div className="skill-meta">
                  <div className="skill-tutor">by {skill.tutor?.name || 'Unknown Tutor'}</div>
                  <div className="skill-category">{skill.category}</div>
                </div>
                
                <div className="skill-rating">
                  <span className="rating-stars">
                    {'★'.repeat(Math.floor(skill.rating))}{'☆'.repeat(5 - Math.floor(skill.rating))}
                  </span>
                  <span className="rating-value">{skill.rating.toFixed(1)}</span>
                  <span className="student-count">({skill.students} students)</span>
                </div>
                
                <p className="skill-description">{skill.description}</p>
                
                <div className="skill-tags">
                  {skill.tags && skill.tags.map((tag, index) => (
                    <span key={index} className="skill-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="skill-level">
                  <span className={`level-badge ${skill.level?.toLowerCase()}`}>
                    {skill.level}
                  </span>
                </div>
                
                <div className="skill-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleViewDetails(skill._id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleBookSession(skill)}
                  >
                    Book Session
                  </button>
                </div>
                
                <div className="skill-extra-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleChatWithTutor(skill)}
                  >
                    Chat with Tutor
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-results">
              <h3>No skills found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseSkills;