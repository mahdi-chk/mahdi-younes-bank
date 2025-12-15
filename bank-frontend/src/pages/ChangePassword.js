import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Constantes pour la validation
const PASSWORD_MIN_LENGTH = 6;

const ChangePassword = () => {
  // États
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Gestionnaires d'événements
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Effacer les messages d'erreur/succès quand l'utilisateur tape
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Validation du formulaire
  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    if (formData.newPassword.length < PASSWORD_MIN_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`);
      return false;
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await authService.changePassword(
        formData.oldPassword, 
        formData.newPassword
      );
      setSuccess(data.message);
      
      // Redirection après succès
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  // Rendu
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Changer le mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Messages d'alerte */}
        {error && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div 
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            role="alert"
          >
            {success}
          </div>
        )}

        {/* Champ ancien mot de passe */}
        <div>
          <label 
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ancien mot de passe
          </label>
          <input
            id="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleInputChange('oldPassword')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
            disabled={loading}
          />
        </div>

        {/* Champ nouveau mot de passe */}
        <div>
          <label 
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange('newPassword')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
            disabled={loading}
            minLength={PASSWORD_MIN_LENGTH}
          />
        </div>

        {/* Champ confirmation mot de passe */}
        <div>
          <label 
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
            disabled={loading}
            minLength={PASSWORD_MIN_LENGTH}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Modification...
              </>
            ) : (
              'Modifier'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;