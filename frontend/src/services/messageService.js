import api from './api';

// Message endpoints
export const messageAPI = {
  // Get messages for a specific session
  getMessagesBySession: (sessionId) => api.get(`/messages/session/${sessionId}`),
  
  // Get all messages for current user
  getUserMessages: () => api.get('/messages'),
  
  // Create a new message
  createMessage: (data) => api.post('/messages', data),
  
  // Get messages between user and tutor
  getMessagesWithTutor: (tutorId) => api.get(`/messages/tutor/${tutorId}`),
  
  // Get conversation between current user and another user
  getConversationWithUser: (userId) => api.get(`/messages/conversation/${userId}`),
};

export default messageAPI;