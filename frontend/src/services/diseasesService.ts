import api from './api';

export const diseasesService = {
  getAll: async (cropId?: string, activeOnly = true) => {
    const response = await api.get('/diseases/', { params: { crop_id: cropId, active_only: activeOnly } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/diseases/${id}`);
    return response.data;
  },

  create: async (data: Record<string, unknown>) => {
    const response = await api.post('/diseases/', data);
    return response.data;
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/diseases/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/diseases/${id}`);
    return response.data;
  },
};
