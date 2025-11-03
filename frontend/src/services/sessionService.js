import api from './api';

// Session endpoints
export const sessionAPI = {
  getAllSessions: () => api.get('/sessions/all'), // Use public endpoint for browse skills
  getAll: () => api.get('/sessions'), // Get user's sessions (created or booked)
  getSessionById: (id) => api.get(`/sessions/${id}`),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  joinSession: (id) => api.post(`/sessions/${id}/join`),
};

export default sessionAPI;