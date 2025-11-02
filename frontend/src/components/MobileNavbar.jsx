import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import './MobileNavbar.css';

const MobileNavbar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/browse", label: "Browse", icon: "🔍" },
    { to: "/messages", label: "Chat", icon: "💬" },
    { to: "/chatbot", label: "SkillBot", icon: "🤖" },
    { to: "/calendar", label: "Calendar", icon: "📅" },
    { to: "/credits", label: "Credits", icon: "💰" }
  ];

  if (!user) return null;

  return (
    <nav className="mobile-navbar">
      <div className="nav-items">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;