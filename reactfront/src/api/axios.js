import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Métodos para estudiantes
  getTodayMenu: async () => {
    const response = await api.get('/api/menu');
    return response.data;
  },

  getMenuByDate: async (date) => {
    const response = await api.get(`/api/menu/${date}`);
    return response.data;
  },

  generateStudentQR: async (studentId) => {
    const response = await api.get(`/api/student/${studentId}/qr`);
    return response.data;
  },

  // Métodos para personal
  validateQR: async (qrData, staffId) => {
    const response = await api.post('/api/staff/validate-qr', {
      qrData,
      staffId
    });
    return response.data;
  },

  getAllMenus: async () => {
    const response = await api.get('/api/staff/menus');
    return response.data;
  },

  saveMenu: async (menuData) => {
    const response = await api.post('/api/staff/menu', menuData);
    return response.data;
  },

  deleteMenu: async (date) => {
    const response = await api.delete(`/api/staff/menu/${date}`);
    return response.data;
  },

  // Métodos de utilidad para pruebas
  createTestStudent: async (studentData) => {
    const response = await api.post('/api/test/student', studentData);
    return response.data;
  },

  createTestStaff: async (staffData) => {
    const response = await api.post('/api/test/staff', staffData);
    return response.data;
  }
};

export default api;
