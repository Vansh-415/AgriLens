import api from './api';

export const scansService = {
  getAll: async (limit = 50, skip = 0) => {
    const response = await api.get('/scans/', { params: { limit, skip } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/scans/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await api.post('/scans/', data);
    return response.data;
  },
};
