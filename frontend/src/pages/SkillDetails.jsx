import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { skillAPI } from '../services/skillService';
import { sessionAPI } from '../services/sessionService';
import { motion } from 'framer-motion';
import './SkillDetails.css';

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedSkills, setRelatedSkills] = useState([]);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the skill details
        const response = await skillAPI.getSkillById(id);
        setSkill(response.data);
        
        // Fetch related skills (same category)
        const relatedResponse = await skillAPI.getAllSkills({
          category: response.data.category,
          limit: 4
        });
        
        // Filter out the current skill
        const filteredSkills = relatedResponse.data.filter(s => s._id !== id);
        setRelatedSkills(filteredSkills);
      } catch (err) {
        console.error('Error fetching skill details:', err);
        setError('Failed to load skill details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSkillDetails();
    }
  }, [id]);

  const handleBookSession = async () => {
    try {
      // Create a session for this skill
      const sessionData = {
        title: `Session for ${skill.name}`,
        description: skill.description,
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 86400000 + 3600000), // 1 hour session
        price: skill.price,
        maxStudents: 10,
        skillId: skill._id
      };
      
      const response = await sessionAPI.createSession(sessionData);
      
      if (response.data) {
        alert(`Session booked successfully for ${skill.name}! Check your calendar.`);
        navigate('/calendar');
      }
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session. Please try again.');
    }
  };

  const handleChatWithTutor = () => {
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
      <div className="skill-details">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading skill details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skill-details">
        <div className="container">
          <div className="error-container">
            <h3>Error Loading Skill</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/browse')}>
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-details">
      <div className="container">
        <motion.div 
          className="skill-details-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="back-button" onClick={() => navigate('/browse')}>
            ← Back to Browse
          </button>
          <h1>{skill?.name}</h1>
        </motion.div>

        <div className="skill-details-content">
          <motion.div 
            className="skill-main-info card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="skill-header">
              <div className="skill-basic-info">
                <h2>{skill?.name}</h2>
                <div className="skill-meta">
                  <span className="skill-tutor">by {skill?.tutor?.name || 'Unknown Tutor'}</span>
                  <span className="skill-category">{skill?.category}</span>
                  <span className={`skill-level ${skill?.level?.toLowerCase()}`}>
                    {skill?.level}
                  </span>
                </div>
              </div>
              <div className="skill-price-tag">
                <span className="price">{skill?.price} credits</span>
              </div>
            </div>

            <div className="skill-rating">
              <span className="rating-stars">
                {'★'.repeat(Math.floor(skill?.rating))}{'☆'.repeat(5 - Math.floor(skill?.rating))}
              </span>
              <span className="rating-value">{skill?.rating?.toFixed(1)}</span>
              <span className="student-count">({skill?.students} students)</span>
            </div>

            <div className="skill-description">
              <h3>Description</h3>
              <p>{skill?.description}</p>
            </div>

            <div className="skill-tags">
              <h3>Tags</h3>
              <div className="tags-container">
                {skill?.tags?.map((tag, index) => (
                  <span key={index} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="skill-actions">
              <button 
                className="btn btn-primary"
                onClick={handleBookSession}
              >
                Book Session
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleChatWithTutor}
              >
                Chat with Tutor
              </button>
            </div>
          </motion.div>

          {relatedSkills.length > 0 && (
            <motion.div 
              className="related-skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3>Related Skills</h3>
              <div className="skills-grid">
                {relatedSkills.map((relatedSkill) => (
                  <div 
                    key={relatedSkill._id} 
                    className="related-skill-card card glass"
                    onClick={() => navigate(`/skills/${relatedSkill._id}`)}
                  >
                    <h4>{relatedSkill.name}</h4>
                    <div className="related-skill-meta">
                      <span className="price">{relatedSkill.price} credits</span>
                      <span className="rating">
                        {'★'.repeat(Math.floor(relatedSkill.rating))} ({relatedSkill.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetails;