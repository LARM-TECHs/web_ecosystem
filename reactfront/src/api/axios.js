import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Servicios de API
export const apiService = {
  // Servicios para estudiantes
  async getStudentQR(studentId) {
    const response = await api.get(`/student/${studentId}/qr`);
    return response.data;
  },

  async getTodayMenu() {
    const response = await api.get('/menu');
    return response.data;
  },

  async getMenuByDate(date) {
    const response = await api.get(`/menu/${date}`);
    return response.data;
  },

  // Servicios para staff
  async validateQR(qrData, staffId) {
    const response = await api.post('/staff/validate-qr', { qrData, staffId });
    return response.data;
  },

  async getAllMenus() {
    const response = await api.get('/staff/menus');
    return response.data;
  },

  async createOrUpdateMenu(menuData) {
    const response = await api.post('/staff/menu', menuData);
    return response.data;
  },

  async deleteMenu(date) {
    const response = await api.delete(`/staff/menu/${date}`);
    return response.data;
  },

  // Servicios de prueba
  async createTestStudent(studentData) {
    const response = await api.post('/test/student', studentData);
    return response.data;
  },

  async createTestStaff(staffData) {
    const response = await api.post('/test/staff', staffData);
    return response.data;
  }
};

export default api;