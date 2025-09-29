import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Trade Talents</span>
        </Link>
        <nav className="nav">
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                <li><Link to="/browse" className="nav-link">Browse Skills</Link></li>
                <li><Link to="/credits" className="nav-link">Buy Credits</Link></li>
                <li><Link to="/messages" className="nav-link">Messages</Link></li>
                <li><Link to="/calendar" className="nav-link">Calendar</Link></li>
                <li className="user-menu">
                  <span className="user-name">{user.name}</span>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="nav-link btn-login">Login</Link></li>
                <li><Link to="/register" className="nav-link btn-signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;