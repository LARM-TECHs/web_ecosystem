const API_BASE = 'http://localhost:3001';

export const apiService = {
  // Estudiante
  async generateQR(studentId) {
    const response = await fetch(`${API_BASE}/api/student/${studentId}/qr`);
    if (!response.ok) {
      throw new Error('Error generando QR');
    }
    return response.json();
  },

  async getTodayMenu() {
    const response = await fetch(`${API_BASE}/api/menu`);
    if (!response.ok) {
      throw new Error('Error obteniendo menú');
    }
    return response.json();
  },

  // Admin
  async validateQR(qrData, staffId) {
    const response = await fetch(`${API_BASE}/api/staff/validate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qrData, staffId }),
    });
    if (!response.ok) {
      throw new Error('Error validando QR');
    }
    return response.json();
  },

  async getMenus() {
    const response = await fetch(`${API_BASE}/api/staff/menus`);
    if (!response.ok) {
      throw new Error('Error obteniendo menús');
    }
    return response.json();
  },

  async saveMenu(menuData) {
    const response = await fetch(`${API_BASE}/api/staff/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });
    if (!response.ok) {
      throw new Error('Error guardando menú');
    }
    return response.json();
  },

  async deleteMenu(date) {
    const response = await fetch(`${API_BASE}/api/staff/menu/${date}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error eliminando menú');
    }
    return response.json();
  }
};