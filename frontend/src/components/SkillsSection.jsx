import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SkillsSection.css';

const SkillsSection = ({ skills, title }) => {
  const getLevelClass = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner': return 'level-beginner';
      case 'intermediate': return 'level-intermediate';
      case 'advanced': return 'level-advanced';
      default: return '';
    }
  };

  return (
    <div className="skills-section card glass">
      <h2 className="section-title">{title}</h2>
      <div className="skills-grid">
        {skills && skills.length > 0 ? (
          skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="skill-info">
                <h3 className="skill-name">{skill.name}</h3>
                <span className={`skill-level ${getLevelClass(skill.level)}`}>
                  {skill.level}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="no-skills">No skills added yet</p>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;