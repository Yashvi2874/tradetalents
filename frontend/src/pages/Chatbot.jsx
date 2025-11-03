import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chatbot from '../components/Chatbot';
import '../components/Chatbot.css';

const ChatbotPage = () => {
  const { user } = useAuth();

  return (
    <div className="chatbot-page">
      <div className="chatbot-page-container">
        <Chatbot user={user} />
      </div>
    </div>
  );
};

export default ChatbotPage;