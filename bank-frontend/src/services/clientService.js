import api from './api';

const clientService = {
  
  createClient: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  getAllClients: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  getClientByNumeroIdentite: async (numeroIdentite) => {
    const response = await api.get(`/clients/numero-identite/${numeroIdentite}`);
    return response.data;
  }
};

export default clientService;