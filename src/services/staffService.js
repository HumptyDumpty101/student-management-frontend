import apiClient from '../utils/apiClient';

export const staffService = {
  getStaff: async (params = {}) => {
    const response = await apiClient.get('/api/v1/staff', { params });
    return response.data;
  },

  getStaffMember: async (id) => {
    const response = await apiClient.get(`/api/v1/staff/${id}`);
    return response.data;
  },

  createStaff: async (staffData) => {
    const response = await apiClient.post('/api/v1/staff', staffData);
    return response.data;
  },

  updateStaff: async (id, staffData) => {
    const response = await apiClient.put(`/api/v1/staff/${id}`, staffData);
    return response.data;
  },

  deleteStaff: async (id) => {
    const response = await apiClient.delete(`/api/v1/staff/${id}`);
    return response.data;
  },

  updatePermissions: async (id, permissions) => {
    const response = await apiClient.put(`/api/v1/staff/${id}/permissions`, permissions);
    return response.data;
  },

  activateStaff: async (id) => {
    const response = await apiClient.post(`/api/v1/staff/${id}/activate`);
    return response.data;
  },

  deactivateStaff: async (id) => {
    const response = await apiClient.post(`/api/v1/staff/${id}/deactivate`);
    return response.data;
  }
};