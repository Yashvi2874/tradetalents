import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    university: 'Example University',
    password: 'password123',
    confirmPassword: 'password123'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simple validation
      if (!formData.name || !formData.email || !formData.university || !formData.password) {
        setErrors({ form: 'Please fill in all fields' });
        setIsSubmitting(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setErrors({ form: 'Passwords do not match' });
        setIsSubmitting(false);
        return;
      }
      
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single click registration
  const handleDemoRegister = async () => {
    setFormData({
      name: 'Jane Smith',
      email: 'jane@example.com',
      university: 'Example University',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    setIsSubmitting(true);
    
    try {
      const result = await register({
        name: 'Jane Smith',
        email: 'jane@example.com',
        university: 'Example University',
        password: 'password123',
        confirmPassword: 'password123'
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Removed Header since it's now in App.jsx */}
      <div className="auth-container">
        <div className="auth-form">
          <h2>Create an Account</h2>
          {errors.form && (
            <div className="error-message">
              {errors.form}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="university">University</label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className={errors.university ? 'error' : ''}
              />
              {errors.university && <span className="error-text">{errors.university}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            <button 
              type="submit" 
              className="btn primary full-width"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div className="demo-register">
            <button 
              onClick={handleDemoRegister}
              className="btn secondary full-width"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Demo Register (Single Click)'}
            </button>
          </div>
          
          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
            <p>
              <Link to="/">Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Removed Footer since it's now in App.jsx */}
    </div>
  );
};

export default Register;