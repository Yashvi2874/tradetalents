import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = ({ sessionId, sessionTitle, isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Mock messages data
  const mockMessages = [
    {
      id: 1,
      sender: 'Alex Johnson',
      senderId: 'tutor1',
      content: 'Hi everyone! Welcome to the JavaScript Fundamentals session.',
      timestamp: new Date(Date.now() - 3600000),
      isTutor: true
    },
    {
      id: 2,
      sender: 'Sarah Miller',
      senderId: 'student1',
      content: 'Excited to learn more about closures today!',
      timestamp: new Date(Date.now() - 3500000),
      isTutor: false
    },
    {
      id: 3,
      sender: 'You',
      senderId: user?.id || 'you',
      content: 'Looking forward to this session. Are we starting with basics?',
      timestamp: new Date(Date.now() - 3400000),
      isTutor: false
    },
    {
      id: 4,
      sender: 'Alex Johnson',
      senderId: 'tutor1',
      content: 'Yes, we\'ll start with the fundamentals and work our way up to more advanced concepts.',
      timestamp: new Date(Date.now() - 3300000),
      isTutor: true
    }
  ];

  useEffect(() => {
    // Simulate loading messages
    setMessages(mockMessages);
  }, [sessionId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: 'You',
      senderId: user?.id || 'you',
      content: newMessage,
      timestamp: new Date(),
      isTutor: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Since we're using side-by-side layout, we don't need to check isOpen
  // The parent component will handle visibility

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <h3>{sessionTitle || 'Session Chat'}</h3>
          <p>Session ID: {sessionId || 'JS101'}</p>
        </div>
        {/* Removed close button since it's side-by-side now */}
      </div>
      
      <div className="chat-session-info">
        <div className="session-details">
          <span className="session-instructor">Instructor: Alex Johnson</span>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.senderId === (user?.id || 'you') ? 'sent' : 'received'} ${message.isTutor ? 'tutor' : ''}`}
          >
            <div className="message-sender">
              {message.sender} {message.isTutor && <span className="tutor-badge">Tutor</span>}
            </div>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;