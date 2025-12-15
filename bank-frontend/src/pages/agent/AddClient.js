import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientService from '../../services/clientService';

const AddClient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroIdentite: '',
    dateAnniversaire: '',
    email: '',
    adressePostale: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await clientService.createClient(formData);
      setSuccess(true);
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        numeroIdentite: '',
        dateAnniversaire: '',
        email: '',
        adressePostale: ''
      });

      // Afficher un message de succès pendant 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err) {
      if (err.response?.data) {
        // Si c'est une erreur de validation
        if (typeof err.response.data === 'object' && !err.response.data.message) {
          setErrors(err.response.data);
        } else {
          // Si c'est un message d'erreur simple
          setErrors({ general: err.response.data.message || 'Une erreur est survenue' });
        }
      } else {
        setErrors({ general: 'Une erreur est survenue' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ajouter un nouveau client
        </h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Client créé avec succès ! Un email contenant les identifiants a été envoyé au client.
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.prenom ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.prenom && (
                <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>
              )}
            </div>

            {/* Numéro d'identité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro d'identité <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="numeroIdentite"
                value={formData.numeroIdentite}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.numeroIdentite ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.numeroIdentite && (
                <p className="text-red-500 text-sm mt-1">{errors.numeroIdentite}</p>
              )}
            </div>

            {/* Date anniversaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'anniversaire <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateAnniversaire"
                value={formData.dateAnniversaire}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateAnniversaire ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.dateAnniversaire && (
                <p className="text-red-500 text-sm mt-1">{errors.dateAnniversaire}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Adresse postale */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse postale <span className="text-red-500">*</span>
              </label>
              <textarea
                name="adressePostale"
                value={formData.adressePostale}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.adressePostale ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.adressePostale && (
                <p className="text-red-500 text-sm mt-1">{errors.adressePostale}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/agent/clients')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Création en cours...' : 'Créer le client'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note :</strong> Les identifiants de connexion (login et mot de passe) 
            seront générés automatiquement et envoyés par email au client.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddClient;