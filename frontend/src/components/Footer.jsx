import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer py-16 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="footer-section">
            <div className="footer-logo flex items-center gap-3 mb-4">
              <span className="logo-icon text-2xl">🎓</span>
              <span className="logo-text text-xl font-bold text-blue-600 dark:text-blue-400">Trade Talents</span>
            </div>
            <p className="footer-description text-gray-600 dark:text-gray-400 mb-6">
              A peer-learning platform for university students to teach and learn practical skills.
            </p>
            <div className="social-links flex gap-4">
              <a href="#" className="social-link text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="social-link text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="social-link text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Facebook</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading text-lg font-semibold mb-6 text-blue-600 dark:text-blue-400">Quick Links</h4>
            <ul className="footer-links space-y-3">
              <li><a href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</a></li>
              <li><a href="/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Login</a></li>
              <li><a href="/register" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Register</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading text-lg font-semibold mb-6 text-blue-600 dark:text-blue-400">Resources</h4>
            <ul className="footer-links space-y-3">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Partners</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading text-lg font-semibold mb-6 text-blue-600 dark:text-blue-400">Contact Us</h4>
            <ul className="footer-links space-y-3">
              <li className="text-gray-600 dark:text-gray-400">Email: support@tradetalents.com</li>
              <li className="text-gray-600 dark:text-gray-400">Phone: +1 (555) 123-4567</li>
              <li className="text-gray-600 dark:text-gray-400">Address: University District, Tech City</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;