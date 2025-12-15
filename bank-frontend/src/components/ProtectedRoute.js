import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h2>
          <p className="text-gray-700">
            Vous n'avez pas le droit d'accéder à cette fonctionnalité.
            Veuillez contacter votre administrateur.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;