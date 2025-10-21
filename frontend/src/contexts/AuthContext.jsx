import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    // Check if there's a user in localStorage
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login function - with actual API call
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      if (response.data) {
        const { token, ...userData } = response.data;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        setLoading(false);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Register function - with actual API call
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.data) {
        const { token, ...userData } = response.data;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        setLoading(false);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};