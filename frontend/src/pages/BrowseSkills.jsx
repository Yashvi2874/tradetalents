import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import './BrowseSkills.css';

const BrowseSkills = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const skills = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      category: 'Programming',
      tutor: 'Alex Johnson',
      rating: 4.8,
      students: 1240,
      price: 25,
      level: 'Beginner',
      description: 'Learn the basics of JavaScript including variables, functions, and DOM manipulation.',
      tags: ['Web Development', 'Frontend', 'JavaScript']
    },
    {
      id: 2,
      name: 'Python for Data Science',
      category: 'Data Science',
      tutor: 'Sarah Miller',
      rating: 4.9,
      students: 890,
      price: 40,
      level: 'Intermediate',
      description: 'Introduction to data analysis with Python using pandas and numpy libraries.',
      tags: ['Python', 'Data Analysis', 'Machine Learning']
    },
    {
      id: 3,
      name: 'UI/UX Design Principles',
      category: 'Design',
      tutor: 'Emma Wilson',
      rating: 4.7,
      students: 650,
      price: 30,
      level: 'Beginner',
      description: 'Fundamental principles of user interface and user experience design.',
      tags: ['Figma', 'Design Thinking', 'Prototyping']
    },
    {
      id: 4,
      name: 'Advanced React Patterns',
      category: 'Programming',
      tutor: 'Michael Chen',
      rating: 4.9,
      students: 720,
      price: 35,
      level: 'Advanced',
      description: 'Learn advanced React patterns and best practices for building scalable applications.',
      tags: ['React', 'Frontend', 'State Management']
    },
    {
      id: 5,
      name: 'Digital Marketing Strategy',
      category: 'Business',
      tutor: 'David Brown',
      rating: 4.6,
      students: 540,
      price: 28,
      level: 'Intermediate',
      description: 'Comprehensive guide to creating and executing digital marketing campaigns.',
      tags: ['SEO', 'Social Media', 'Analytics']
    },
    {
      id: 6,
      name: 'Photography Basics',
      category: 'Creative',
      tutor: 'Lisa Garcia',
      rating: 4.8,
      students: 420,
      price: 22,
      level: 'Beginner',
      description: 'Learn the fundamentals of photography including composition and lighting.',
      tags: ['Camera', 'Composition', 'Lighting']
    }
  ];

  const categories = ['all', 'Programming', 'Data Science', 'Design', 'Business', 'Creative'];

  const filteredSkills = skills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.students - a.students;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
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
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
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
                  <div className="skill-tutor">by {skill.tutor}</div>
                  <div className="skill-category">{skill.category}</div>
                </div>
                
                <div className="skill-rating">
                  <span className="rating-stars">
                    {'★'.repeat(Math.floor(skill.rating))}{'☆'.repeat(5 - Math.floor(skill.rating))}
                  </span>
                  <span className="rating-value">{skill.rating}</span>
                  <span className="student-count">({skill.students} students)</span>
                </div>
                
                <p className="skill-description">{skill.description}</p>
                
                <div className="skill-tags">
                  {skill.tags.map((tag, index) => (
                    <span key={index} className="skill-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="skill-level">
                  <span className={`level-badge ${skill.level.toLowerCase()}`}>
                    {skill.level}
                  </span>
                </div>
                
                <div className="skill-actions">
                  <button className="btn btn-secondary">View Details</button>
                  <button className="btn btn-primary">Book Session</button>
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