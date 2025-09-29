import React, { useState } from 'react';
import './SkillsSection.css';

const SkillsSection = ({ skills, onAddSkill }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.name && newSkill.level) {
      onAddSkill(newSkill);
      setNewSkill({ name: '', level: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="skills-section">
      <div className="skills-header">
        <h2>My Skills</h2>
        <button 
          className="btn-add-skill"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-skill-form" onSubmit={handleAddSkill}>
          <div className="form-group">
            <label htmlFor="skillName">Skill Name</label>
            <input
              type="text"
              id="skillName"
              value={newSkill.name}
              onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
              placeholder="Enter skill name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skillLevel">Proficiency Level</label>
            <select
              id="skillLevel"
              value={newSkill.level}
              onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
              required
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <button type="submit" className="btn-submit">Add Skill</button>
        </form>
      )}

      <div className="skills-grid">
        {skills && skills.length > 0 ? (
          skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <h3 className="skill-name">{skill.name}</h3>
              <p className="skill-level">Level: {skill.level}</p>
              <button className="btn-teach">Offer to Teach</button>
            </div>
          ))
        ) : (
          <div className="no-skills">
            <p>You haven't added any skills yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;