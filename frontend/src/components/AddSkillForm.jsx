import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { skillAPI } from '../services/skillService';
import './AddSkillForm.css';

const AddSkillForm = ({ onSkillAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    level: 'Beginner',
    tags: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Programming', 'Data Science', 'Design', 'Business', 
    'Creative', 'Language', 'Music', 'Fitness', 'Cooking'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare data for submission
      const skillData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        price: Number(formData.price)
      };

      const response = await skillAPI.createSkill(skillData);
      
      setSuccess(true);
      setFormData({
        name: '',
        category: '',
        description: '',
        level: 'Beginner',
        tags: '',
        price: ''
      });
      
      // Notify parent component
      if (onSkillAdded) {
        onSkillAdded(response.data);
      }
    } catch (err) {
      console.error('Error creating skill:', err);
      setError(err.response?.data?.message || 'Failed to create skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="add-skill-form card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="form-title">Add New Skill</h2>
      
      {success && (
        <div className="success-message">
          Skill created successfully!
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Skill Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter skill name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your skill in detail..."
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">Level *</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (Credits) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="1"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Frontend"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Add Skill'}
        </button>
      </form>
    </motion.div>
  );
};

export default AddSkillForm;