import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../services/chatbotService';
import './Chatbot.css';

const Chatbot = ({ user, skillContext }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      userId: 'chatbot',
      userName: 'Talon',
      content: 'Hello! I\'m your Talon your Skillbot. How can I help you with your learning journey today?',
      timestamp: new Date(),
      isTutor: true,
      system: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      userId: user?._id,
      userName: user?.name || 'You',
      content: newMessage,
      timestamp: new Date(),
      isTutor: false,
      system: false
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Clear input
    const userInput = newMessage;
    setNewMessage('');

    try {
      // Get chatbot response
      const context = skillContext 
        ? `User is interested in ${skillContext.skillName}` 
        : 'General platform assistance';
        
      const response = await chatbotAPI.getResponse({
        message: userInput,
        context: context
      });

      // Add chatbot response to chat
      const botMessage = {
        id: Date.now() + 1,
        userId: 'chatbot',
        userName: 'Talon',
        content: response.data.response,
        timestamp: new Date(),
        isTutor: true,
        system: false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        userId: 'chatbot',
        userName: 'Talon',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isTutor: true,
        system: false
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`chatbot-message ${message.userId === user?._id ? 'sent' : 'received'} ${message.system ? 'system' : ''}`}
          >
            {!message.system && (
              <div className="chatbot-message-sender">
                {message.userName} {message.isTutor && <span className="chatbot-tutor-badge">Assistant</span>}
              </div>
            )}
            <div className="chatbot-message-content">
              {message.content}
            </div>
            <div className="chatbot-message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chatbot-message received">
            <div className="chatbot-message-sender">
              SkillBot <span className="chatbot-tutor-badge">Assistant</span>
            </div>
            <div className="chatbot-message-content">
              <div className="chatbot-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chatbot-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask me anything about learning..."
          className="chatbot-message-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="chatbot-send-button"
          disabled={isLoading || newMessage.trim() === ''}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;