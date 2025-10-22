import api from './api';

// Session endpoints
export const sessionAPI = {
  getAllSessions: () => api.get('/sessions'),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  joinSession: (id) => api.post(`/sessions/${id}/join`),
};

export default sessionAPI;