import React, { createContext, useContext, useState, useEffect } from 'react';

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
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function - no verification required
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate instant login without API call
      const user = {
        id: Date.now(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        university: 'Example University',
        credits: 100
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = 'Login failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Register function - no verification required
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate instant registration without API call
      const user = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        university: userData.university,
        credits: 50 // New users get 50 credits
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = 'Registration failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
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