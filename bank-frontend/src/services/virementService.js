import api from './api';

const virementService = {
  
  effectuerVirement: async (virementData) => {
    const response = await api.post('/virements', virementData);
    return response.data;
  }
};

export default virementService;