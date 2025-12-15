import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import compteService from '../../services/compteService';
import clientService from '../../services/clientService';
import api from '../../services/api'; // ⚠ Assure-toi que ce fichier existe

const AddAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);

  const [formData, setFormData] = useState({
    rib: '',
    numeroIdentiteClient: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'numeroIdentiteClient') {
      setClientInfo(null);
    }
  };

  /** ------------------------------------
   * 🔹 Génération automatique du RIB
   ------------------------------------ */
  const generateRib = async () => {
    try {
      const response = await api.get('/rib/generate');
      setFormData(prev => ({
        ...prev,
        rib: response.data.rib
      }));
    } catch (err) {
      console.error('Erreur génération RIB:', err);
      setErrors({ general: "Impossible de générer un RIB pour le moment." });
    }
  };

  /** ------------------------------------
   * 🔍 Recherche client par numéro identite
   ------------------------------------ */
  const handleSearchClient = async () => {
    if (!formData.numeroIdentiteClient) {
      setErrors({ numeroIdentiteClient: "Veuillez saisir un numéro d'identité" });
      return;
    }

    setSearchLoading(true);
    setErrors({});

    try {
      const client = await clientService.getClientByNumeroIdentite(formData.numeroIdentiteClient);
      setClientInfo(client);
    } catch (err) {
      setErrors({ numeroIdentiteClient: "Client non trouvé avec ce numéro d'identité" });
      setClientInfo(null);
    } finally {
      setSearchLoading(false);
    }
  };

  /** ------------------------------------
   * 📨 Soumission formulaire
   ------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!clientInfo) {
      setErrors({ numeroIdentiteClient: "Veuillez d'abord rechercher le client" });
      setLoading(false);
      return;
    }

    try {
      await compteService.createCompte(formData);

      setSuccess(true);
      setFormData({ rib: '', numeroIdentiteClient: '' });
      setClientInfo(null);

      setTimeout(() => setSuccess(false), 5000);

    } catch (err) {
      if (err.response?.data) {
        if (typeof err.response.data === 'object' && !err.response.data.message) {
          setErrors(err.response.data);
        } else {
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Créer un nouveau compte bancaire
        </h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Compte bancaire créé avec succès !
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* RIB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RIB (24 chiffres) <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                name="rib"
                value={formData.rib}
                onChange={handleChange}
                maxLength="24"
                placeholder="000000000000000000000000"
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                  errors.rib ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />

              <button
                type="button"
                onClick={generateRib}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Générer
              </button>
            </div>

            {errors.rib && (
              <p className="text-red-500 text-sm mt-1">{errors.rib}</p>
            )}
          </div>

          {/* Numéro d'identité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro d'identité du client <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                name="numeroIdentiteClient"
                value={formData.numeroIdentiteClient}
                onChange={handleChange}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.numeroIdentiteClient ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={handleSearchClient}
                disabled={searchLoading || !formData.numeroIdentiteClient}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {searchLoading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {errors.numeroIdentiteClient && (
              <p className="text-red-500 text-sm mt-1">{errors.numeroIdentiteClient}</p>
            )}
          </div>

          {/* Informations du client */}
          {clientInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Informations du client</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Nom complet:</span>
                  <p className="font-medium">{clientInfo.prenom} {clientInfo.nom}</p>
                </div>
                <div>
                  <span className="text-gray-600">Numéro d'identité:</span>
                  <p className="font-medium">{clientInfo.numeroIdentite}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{clientInfo.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Identifiant:</span>
                  <p className="font-medium">{clientInfo.username}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/agent/comptes')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading || !clientInfo}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Création en cours...' : 'Créer le compte'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> Le compte sera créé avec le statut "Ouvert" et un solde initial de 0.00 DH.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
