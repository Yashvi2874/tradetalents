import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MobileHeader.css';

const MobileHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  return (
    <header className="mobile-header">
      <div className="header-content">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span 
            className="logo-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Trade Talents
          </motion.span>
        </motion.div>
        
        <div className="header-user-info">
          {user && (
            <motion.button 
              className="user-avatar"
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
            >
              <span className="avatar-text">{user.name.charAt(0).toUpperCase()}</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;