import api from './api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  }
};

export default authService;