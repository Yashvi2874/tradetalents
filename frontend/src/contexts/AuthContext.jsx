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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Check if there's a user in localStorage
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (savedUser && token) {
          // Validate token with backend
          try {
            const response = await authAPI.getCurrentUser();
            if (response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (e) {
            // Token invalid or network error, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function - with actual API call
  const login = async (credentials) => {
    try {
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      if (response.data) {
        const { token, ...userData } = response.data;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Register function - with actual API call
  const register = async (userData) => {
    try {
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.data) {
        const { token, ...userData } = response.data;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Optional: Call backend logout endpoint
    try {
      await authAPI.logout();
    } catch (e) {
      console.error('Logout API call failed:', e);
    }
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