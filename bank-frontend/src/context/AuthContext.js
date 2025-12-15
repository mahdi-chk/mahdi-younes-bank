import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si le token est expiré au chargement
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      checkTokenExpiration();
    }
  }, [token]);

  const checkTokenExpiration = () => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(loginTime);
      const oneHour = 3600000; // 1 heure en millisecondes

      // RG_3: Vérifier si le token est expiré
      if (elapsedTime >= oneHour) {
        logout();
        alert('Session invalide, veuillez vous authentifier');
      } else {
        // Planifier le logout automatique
        const remainingTime = oneHour - elapsedTime;
        setTimeout(() => {
          logout();
          alert('Session invalide, veuillez vous authentifier');
        }, remainingTime);
      }
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginTime', new Date().getTime().toString());
    setToken(token);
    setUser(userData);

    // Rediriger selon le rôle
    if (userData.role === 'AGENT_GUICHET') {
      navigate('/agent/dashboard');
    } else {
      navigate('/client/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};