import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdditionalProfileInfo = ({ onSkip, onComplete }) => {
  const [formData, setFormData] = useState({
    linkedin: '',
    github: '',
    degree: '',
    yearOfStudy: '',
    userSkills: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate URLs if provided
    if (formData.linkedin && !formData.linkedin.startsWith('https://')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL starting with https://';
    }
    
    if (formData.github && !formData.github.startsWith('https://')) {
      newErrors.github = 'Please enter a valid GitHub URL starting with https://';
    }
    
    // Validate year of study if provided
    if (formData.yearOfStudy) {
      const year = parseInt(formData.yearOfStudy);
      if (isNaN(year) || year < 1 || year > 10) {
        newErrors.yearOfStudy = 'Please enter a valid year between 1 and 10';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert userSkills string to array
      const userSkillsArray = formData.userSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      const profileData = {
        linkedin: formData.linkedin || undefined,
        github: formData.github || undefined,
        degree: formData.degree || undefined,
        yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy) : undefined,
        userSkills: userSkillsArray
      };
      
      const result = await updateProfile(profileData);
      if (result.success) {
        onComplete();
      } else {
        setErrors({ form: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-auth">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />

      <div className="auth-card">
        <h1 className="auth-title">Additional Information</h1>
        <p className="auth-subtitle">Help us get to know you better (Optional)</p>
        <div className="auth-underline"></div>

        {errors.form && (
          <div className="auth-error-form">
            {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="linkedin">LinkedIn Profile</label>
          <input
            className={`auth-input ${errors.linkedin ? 'error' : ''}`}
            id="linkedin"
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            aria-invalid={errors.linkedin ? 'true' : 'false'}
          />
          {errors.linkedin && <span className="auth-error-field">{errors.linkedin}</span>}

          <label className="auth-label" htmlFor="github">GitHub Profile</label>
          <input
            className={`auth-input ${errors.github ? 'error' : ''}`}
            id="github"
            name="github"
            type="url"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
            aria-invalid={errors.github ? 'true' : 'false'}
          />
          {errors.github && <span className="auth-error-field">{errors.github}</span>}

          <label className="auth-label" htmlFor="degree">Degree</label>
          <input
            className={`auth-input ${errors.degree ? 'error' : ''}`}
            id="degree"
            name="degree"
            type="text"
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g., Computer Science, Business Administration"
            aria-invalid={errors.degree ? 'true' : 'false'}
          />
          {errors.degree && <span className="auth-error-field">{errors.degree}</span>}

          <label className="auth-label" htmlFor="yearOfStudy">Year of Study</label>
          <input
            className={`auth-input ${errors.yearOfStudy ? 'error' : ''}`}
            id="yearOfStudy"
            name="yearOfStudy"
            type="number"
            min="1"
            max="10"
            value={formData.yearOfStudy}
            onChange={handleChange}
            placeholder="e.g., 1, 2, 3, 4"
            aria-invalid={errors.yearOfStudy ? 'true' : 'false'}
          />
          {errors.yearOfStudy && <span className="auth-error-field">{errors.yearOfStudy}</span>}

          <label className="auth-label" htmlFor="userSkills">Skills Related to Your Degree</label>
          <textarea
            className={`auth-input ${errors.userSkills ? 'error' : ''}`}
            id="userSkills"
            name="userSkills"
            value={formData.userSkills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, Python, Marketing, Finance (separate with commas)"
            aria-invalid={errors.userSkills ? 'true' : 'false'}
            rows="3"
          />
          {errors.userSkills && <span className="auth-error-field">{errors.userSkills}</span>}

          <div className="auth-form-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onSkip}
              disabled={isSubmitting}
            >
              Skip for Now
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Information'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdditionalProfileInfo;