import api from './api';

export const cropsService = {
  getAll: async (activeOnly = true) => {
    const response = await api.get('/crops/', { params: { active_only: activeOnly } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/crops/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await api.post('/crops/', data);
    return response.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/crops/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/crops/${id}`);
    return response.data;
  },
};
