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

  predictDisease: async (file: File, landAcres = 1.0, useTta = true) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/predict/', formData, {
      params: { land_acres: landAcres, use_tta: useTta },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
