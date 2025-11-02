import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../services/chatbotService';
import './Chat.css';

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
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Skillbot Assistant</h3>
          <p>Your AI learning companion</p>
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
                {message.userName} {message.isTutor && <span className="tutor-badge">Assistant</span>}
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
        {isLoading && (
          <div className="message received">
            <div className="message-sender">
              SkillBot <span className="tutor-badge">Assistant</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask me anything about learning..."
          className="message-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || newMessage.trim() === ''}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;