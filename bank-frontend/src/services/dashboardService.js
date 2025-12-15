import api from './api';

const dashboardService = {
  
  getMesComptes: async () => {
    const response = await api.get('/dashboard/mes-comptes');
    return response.data;
  },

  getDashboardDefault: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getDashboard: async (rib) => {
    const response = await api.get(`/dashboard/${rib}`);
    return response.data;
  },

  getOperations: async (rib, page = 0, size = 10) => {
    const response = await api.get(`/dashboard/${rib}/operations`, {
      params: { page, size }
    });
    return response.data;
  }
};

export default dashboardService;