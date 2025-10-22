import api from './api';

// Skill endpoints
export const skillAPI = {
  getAllSkills: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/skills${queryParams ? `?${queryParams}` : ''}`;
    return api.get(url);
  },
  getSkillById: (id) => api.get(`/skills/${id}`),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export default skillAPI;