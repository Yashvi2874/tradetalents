import api from './api';

// Chatbot endpoints
export const chatbotAPI = {
  // Get general chatbot response
  getResponse: (data) => api.post('/chatbot/message', data),
  
  // Get skill assistant response
  getSkillAssistantResponse: (data) => api.post('/chatbot/skill-assistant', data),
};

export default chatbotAPI;