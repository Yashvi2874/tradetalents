import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chatbot from '../components/Chatbot';
import './Messages.css';

const ChatbotPage = () => {
  const { user } = useAuth();

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <h1>SkillBot Assistant</h1>
          <p>Your AI-powered learning companion</p>
        </div>
        
        <div className="chat-container-full">
          <Chatbot user={user} />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;