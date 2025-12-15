import api from './api';

const compteService = {
  
  createCompte: async (compteData) => {
    const response = await api.post('/comptes', compteData);
    return response.data;
  },

  getAllComptes: async () => {
    const response = await api.get('/comptes');
    return response.data;
  },

  getCompteByRib: async (rib) => {
    const response = await api.get(`/comptes/rib/${rib}`);
    return response.data;
  },

  getComptesByNumeroIdentite: async (numeroIdentite) => {
    const response = await api.get(`/comptes/client/numero-identite/${numeroIdentite}`);
    return response.data;
  },

  getComptesByClientId: async (clientId) => {
    const response = await api.get(`/comptes/client/${clientId}`);
    return response.data;
  }
};

export default compteService;