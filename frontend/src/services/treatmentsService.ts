import api from './api';

export const treatmentsService = {
  getAll: async (activeOnly = true) => {
    const response = await api.get('/treatments/', { params: { active_only: activeOnly } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/treatments/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await api.post('/treatments/', data);
    return response.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/treatments/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/treatments/${id}`);
    return response.data;
  },
};
