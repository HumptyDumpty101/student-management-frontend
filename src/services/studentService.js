import apiClient from '../utils/apiClient';

export const studentService = {
  getStudents: async (params = {}) => {
    const response = await apiClient.get('/api/v1/students', { params });
    return response.data;
  },

  getStudent: async (id) => {
    const response = await apiClient.get(`/api/v1/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await apiClient.post('/api/v1/students', studentData);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await apiClient.put(`/api/v1/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await apiClient.delete(`/api/v1/students/${id}`);
    return response.data;
  },

  uploadPhoto: async (id, photo) => {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await apiClient.post(`/api/v1/students/${id}/photo`, formData);
    return response.data;
  },

  deletePhoto: async (id) => {
    const response = await apiClient.delete(`/api/v1/students/${id}/photo`);
    return response.data;
  }
};