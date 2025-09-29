import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'student@example.com',
    password: 'password123'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
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
      if (!formData.email || !formData.password) {
        setErrors({ form: 'Please fill in all fields' });
        setIsSubmitting(false);
        return;
      }
      
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single click login
  const handleDemoLogin = async () => {
    setFormData({
      email: 'student@example.com',
      password: 'password123'
    });
    
    setIsSubmitting(true);
    
    try {
      const result = await login({
        email: 'student@example.com',
        password: 'password123'
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: result.error || 'Login failed' });
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
          <h2>Login to Your Account</h2>
          {errors.form && (
            <div className="error-message">
              {errors.form}
            </div>
          )}
          <form onSubmit={handleSubmit}>
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
            <button 
              type="submit" 
              className="btn primary full-width"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="demo-login">
            <button 
              onClick={handleDemoLogin}
              className="btn secondary full-width"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Demo Login (Single Click)'}
            </button>
          </div>
          
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
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

export default Login;