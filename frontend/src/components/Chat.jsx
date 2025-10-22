import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import './Chat.css';

const Chat = ({ sessionId, sessionTitle, isOpen, onClose, tutorId, tutorName, skillContext }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Use import.meta.env for Vite applications instead of process.env
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    // Create socket connection
    socketRef.current = io(API_URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    // Join the session room or create a tutor chat room
    const roomId = sessionId || `tutor-${tutorId}-${user?._id}`;
    
    socketRef.current.emit('join-session', {
      sessionId: roomId,
      userId: user?._id,
      userName: user?.name || 'Anonymous'
    });

    // Listen for incoming messages
    socketRef.current.on('receive-message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Listen for typing indicators
    socketRef.current.on('user-typing', (data) => {
      if (data.userId !== user?._id) {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev, data.userName]);
        } else {
          setTypingUsers(prev => prev.filter(name => name !== data.userName));
        }
      }
    });

    // Listen for user join/leave events
    socketRef.current.on('user-joined', (data) => {
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        system: true,
        content: data.message,
        timestamp: new Date()
      }]);
    });

    socketRef.current.on('user-left', (data) => {
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        system: true,
        content: data.message,
        timestamp: new Date()
      }]);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId, tutorId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    let typingTimeout;
    
    if (newMessage.trim() !== '') {
      // Emit typing start
      const roomId = sessionId || `tutor-${tutorId}-${user?._id}`;
      
      socketRef.current?.emit('typing', {
        sessionId: roomId,
        userId: user?._id,
        userName: user?.name || 'Anonymous',
        isTyping: true
      });
      
      // Set timeout to emit typing stop
      typingTimeout = setTimeout(() => {
        socketRef.current?.emit('typing', {
          sessionId: roomId,
          userId: user?._id,
          userName: user?.name || 'Anonymous',
          isTyping: false
        });
      }, 1000);
    }
    
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        const roomId = sessionId || `tutor-${tutorId}-${user?._id}`;
        
        socketRef.current?.emit('typing', {
          sessionId: roomId,
          userId: user?._id,
          userName: user?.name || 'Anonymous',
          isTyping: false
        });
      }
    };
  }, [newMessage, sessionId, tutorId, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Emit the message to the server
    const roomId = sessionId || `tutor-${tutorId}-${user?._id}`;
    
    socketRef.current?.emit('send-message', {
      sessionId: roomId,
      userId: user?._id,
      userName: user?.name || 'Anonymous',
      content: newMessage
    });

    // Clear the input
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine chat title
  const getChatTitle = () => {
    if (sessionTitle) return sessionTitle;
    if (tutorName) return `Chat with ${tutorName}`;
    return 'Chat';
  };

  // Since we're using side-by-side layout, we don't need to check isOpen
  // The parent component will handle visibility

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <h3>{getChatTitle()}</h3>
          {skillContext && (
            <p>Skill: {skillContext.skillName}</p>
          )}
        </div>
        {/* Removed close button since it's side-by-side now */}
      </div>
      
      <div className="chat-session-info">
        <div className="session-details">
          <span className="session-instructor">
            {tutorName ? `Tutor: ${tutorName}` : `Instructor: ${user?.name || 'Instructor'}`}
          </span>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.userId === user?._id ? 'sent' : 'received'} ${message.system ? 'system' : ''}`}
          >
            {!message.system && (
              <div className="message-sender">
                {message.userName} {message.isTutor && <span className="tutor-badge">Tutor</span>}
              </div>
            )}
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
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