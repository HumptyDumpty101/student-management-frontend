import apiClient from '../utils/apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post('/api/v1/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await apiClient.post('/api/v1/auth/logout', { refreshToken });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post('/api/v1/auth/change-password', passwordData);
    return response.data;
  }
};