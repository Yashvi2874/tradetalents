import api from './api';

// Message endpoints
export const messageAPI = {
  // Get messages for a specific session
  getMessagesBySession: (sessionId) => api.get(`/messages/session/${sessionId}`),
  
  // Get all messages for current user
  getUserMessages: () => api.get('/messages'),
  
  // Create a new message
  createMessage: (data) => api.post('/messages', data),
};

export default messageAPI;