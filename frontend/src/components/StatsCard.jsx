import React from 'react';
import { motion } from 'framer-motion';
import './StatsCard.css';

const StatsCard = ({ title, value, change, icon }) => {
  return (
    <motion.div 
      className="stats-card glass"
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="stats-icon">
        {icon}
      </div>
      <div className="stats-info">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        <p className="stats-change">{change}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;