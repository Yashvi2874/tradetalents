import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Update aria-invalid attributes based on errors
  useEffect(() => {
    const fields = ['name', 'email', 'university', 'password', 'confirmPassword'];
    fields.forEach(fieldName => {
      const inputEl = document.getElementById(fieldName);
      if (inputEl) {
        if (errors[fieldName]) {
          inputEl.setAttribute('aria-invalid', 'true');
        } else {
          inputEl.removeAttribute('aria-invalid');
        }
      }
    });
  }, [errors]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    } else if (formData.university.trim().length < 2) {
      newErrors.university = 'University name must be at least 2 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="page-auth"
      onMouseMove={(e) => {
        const card = e.currentTarget.querySelector('.auth-card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${Math.min(Math.max(e.clientX - r.left, 0), r.width)}px`);
        card.style.setProperty('--my', `${Math.min(Math.max(e.clientY - r.top, 0), r.height)}px`);
      }}
    >
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />

      <div className="auth-card">
        <h1 className="auth-title">Create an Account</h1>
        <div className="auth-underline"></div>

        {errors.form && (
          <div className="auth-error-form">
            {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="name">Full Name</label>
          <input
            className={`auth-input ${errors.name ? 'error' : ''}`}
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            aria-invalid={errors.name ? 'true' : 'false'}
            required
          />
          {errors.name && <span className="auth-error-field">{errors.name}</span>}

          <label className="auth-label" htmlFor="email">Email</label>
          <input
            className={`auth-input ${errors.email ? 'error' : ''}`}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            aria-invalid={errors.email ? 'true' : 'false'}
            required
          />
          {errors.email && <span className="auth-error-field">{errors.email}</span>}

          <label className="auth-label" htmlFor="university">University</label>
          <input
            className={`auth-input ${errors.university ? 'error' : ''}`}
            id="university"
            name="university"
            type="text"
            value={formData.university}
            onChange={handleChange}
            placeholder="Enter your university"
            aria-invalid={errors.university ? 'true' : 'false'}
            required
          />
          {errors.university && <span className="auth-error-field">{errors.university}</span>}

          <label className="auth-label" htmlFor="password">Password</label>
          <input
            className={`auth-input ${errors.password ? 'error' : ''}`}
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            aria-invalid={errors.password ? 'true' : 'false'}
            required
          />
          {errors.password && <span className="auth-error-field">{errors.password}</span>}

          <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            required
          />
          {errors.confirmPassword && <span className="auth-error-field">{errors.confirmPassword}</span>}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-foot">
          Already have an account? <Link className="auth-link" to="/login">Login here</Link><br/>
          <Link className="auth-link" to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;