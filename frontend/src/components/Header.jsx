import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close menu if clicking outside and menu is open
      if (isMenuOpen && !e.target.closest('.nav') && !e.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Navigation items for logged in users (optimized order)
  const loggedInNavItems = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/browse", label: "Browse" },
    { to: "/messages", label: "Chat" },
    { to: "/calendar", label: "Calendar" },
    { to: "/credits", label: "Credits" }
  ];

  // Navigation items for guests
  const guestNavItems = [
    { to: "/", label: "Home" }
  ];

  return (
    <header className="header">
      <div className="container">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span 
            className="logo-icon"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🎓
          </motion.span>
          <motion.span 
            className="logo-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Trade Talents
          </motion.span>
        </motion.div>
        
        <div className="header-right">
          <div className="menu-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`nav ${isMenuOpen ? 'mobile-open' : ''}`}>
            <ul>
              {(user ? loggedInNavItems : guestNavItems).map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1, duration: 0.3 }}
                >
                  <NavLink to={item.to} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
              
              {user ? (
                <motion.li
                  className="user-menu"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <motion.span 
                    className="user-name"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => navigate('/dashboard/profile')}
                  >
                    {user.name}
                  </motion.span>
                  <motion.button 
                    onClick={handleLogout} 
                    className="btn-logout"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </motion.li>
              ) : (
                <>
                  <motion.li
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <NavLink to="/login" className={({isActive}) => `nav-link btn-login ${isActive ? 'active' : ''}`}>
                      Login
                    </NavLink>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                  >
                    <NavLink to="/register" className={({isActive}) => `nav-link btn-signup ${isActive ? 'active' : ''}`}>
                      Sign Up
                    </NavLink>
                  </motion.li>
                </>
              )}
            </ul>
          </nav>
          
          <motion.button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.3 }}
          >
            <span className="theme-icon" aria-hidden>
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;