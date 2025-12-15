import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import virementService from '../../services/virementService';
import dashboardService from '../../services/dashboardService';

const Virement = () => {
  const navigate = useNavigate();
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [virementInfo, setVirementInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    ribSource: '',
    ribDestinataire: '',
    montant: '',
    motif: ''
  });

  useEffect(() => {
    fetchComptes();
  }, []);

  const fetchComptes = async () => {
    try {
      const data = await dashboardService.getMesComptes();
      setComptes(data);
      
      // Sélectionner automatiquement le premier compte s'il n'y en a qu'un
      if (data.length === 1) {
        setFormData(prev => ({
          ...prev,
          ribSource: data[0].rib
        }));
      }
    } catch (err) {
      setErrors({ general: 'Erreur lors du chargement des comptes' });
    }
  };

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validations côté client
    if (!formData.ribSource) {
      setErrors({ ribSource: 'Veuillez sélectionner un compte' });
      return;
    }
    
    if (formData.ribSource === formData.ribDestinataire) {
      setErrors({ ribDestinataire: 'Vous ne pouvez pas effectuer un virement vers votre propre compte' });
      return;
    }
    
    if (parseFloat(formData.montant) <= 0) {
      setErrors({ montant: 'Le montant doit être supérieur à 0' });
      return;
    }
    
    // Afficher la confirmation
    setShowConfirmation(true);
  };

  const confirmVirement = async () => {
    setLoading(true);
    setErrors({});

    try {
      const response = await virementService.effectuerVirement({
        ribSource: formData.ribSource,
        ribDestinataire: formData.ribDestinataire,
        montant: parseFloat(formData.montant),
        motif: formData.motif
      });
      
      setVirementInfo(response);
      setSuccess(true);
      setShowConfirmation(false);
      
      // Réinitialiser le formulaire
      setFormData({
        ribSource: comptes.length === 1 ? comptes[0].rib : '',
        ribDestinataire: '',
        montant: '',
        motif: ''
      });

    } catch (err) {
      setShowConfirmation(false);
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

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const getCompteInfo = (rib) => {
    return comptes.find(c => c.rib === rib);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Nouveau virement
        </h2>

        {success && virementInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-green-800">Virement effectué avec succès !</h3>
                <div className="mt-3 text-sm text-green-700 space-y-1">
                  <p><strong>Montant:</strong> {virementInfo.montant.toFixed(2)} DH</p>
                  <p><strong>Bénéficiaire:</strong> {virementInfo.ribDestinataire}</p>
                  <p><strong>Motif:</strong> {virementInfo.motif}</p>
                  <p><strong>Date:</strong> {new Date(virementInfo.dateVirement).toLocaleString('fr-MA')}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/client/dashboard')}
                    className="text-green-700 hover:text-green-800 font-semibold"
                  >
                    Voir mon tableau de bord →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Compte source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Débiter le compte <span className="text-red-500">*</span>
            </label>
            {comptes.length === 1 ? (
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                <p className="font-mono font-semibold">{formData.ribSource}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Solde: {getCompteInfo(formData.ribSource)?.solde.toFixed(2)} DH
                </p>
              </div>
            ) : (
              <select
                name="ribSource"
                value={formData.ribSource}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.ribSource ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Sélectionnez un compte</option>
                {comptes.map((compte) => (
                  <option key={compte.id} value={compte.rib}>
                    {compte.rib} - Solde: {compte.solde.toFixed(2)} DH
                  </option>
                ))}
              </select>
            )}
            {errors.ribSource && (
              <p className="text-red-500 text-sm mt-1">{errors.ribSource}</p>
            )}
          </div>

          {/* RIB destinataire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RIB destinataire <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ribDestinataire"
              value={formData.ribDestinataire}
              onChange={handleChange}
              maxLength="24"
              placeholder="000000000000000000000000"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                errors.ribDestinataire ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.ribDestinataire && (
              <p className="text-red-500 text-sm mt-1">{errors.ribDestinataire}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (DH) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.montant ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.montant && (
              <p className="text-red-500 text-sm mt-1">{errors.montant}</p>
            )}
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              maxLength="255"
              placeholder="Ex: Loyer, Remboursement, Cadeau..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.motif ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.motif && (
              <p className="text-red-500 text-sm mt-1">{errors.motif}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/client/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Valider
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmer le virement
            </h3>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Compte source:</span>
                <span className="font-mono font-semibold">{formData.ribSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compte destinataire:</span>
                <span className="font-mono font-semibold">{formData.ribDestinataire}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant:</span>
                <span className="font-bold text-lg text-blue-600">
                  {parseFloat(formData.montant).toFixed(2)} DH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Motif:</span>
                <span className="font-semibold">{formData.motif}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Attention:</strong> Cette opération est irréversible. 
                Veuillez vérifier les informations avant de confirmer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelConfirmation}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmVirement}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Virement;