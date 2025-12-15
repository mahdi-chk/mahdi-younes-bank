import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const [comptes, setComptes] = useState([]);
  const [selectedRib, setSelectedRib] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllOperations, setShowAllOperations] = useState(false);
  const [operationsPage, setOperationsPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedRib) {
      fetchDashboard(selectedRib);
    }
  }, [selectedRib]);

  const fetchInitialData = async () => {
    try {
      const comptesData = await dashboardService.getMesComptes();
      setComptes(comptesData);

      if (comptesData.length > 0) {
        // Charger le dashboard du premier compte (le plus récemment utilisé)
        const dashboardData = await dashboardService.getDashboardDefault();
        setDashboard(dashboardData);
        setSelectedRib(dashboardData.rib);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async (rib) => {
    setLoading(true);
    setShowAllOperations(false);
    try {
      const data = await dashboardService.getDashboard(rib);
      setDashboard(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadAllOperations = async (page = 0) => {
    try {
      const data = await dashboardService.getOperations(selectedRib, page, 10);
      setOperationsPage(data);
      setCurrentPage(page);
      setShowAllOperations(true);
    } catch (err) {
      setError('Erreur lors du chargement des opérations');
    }
  };

  const handleCompteChange = (e) => {
    setSelectedRib(e.target.value);
  };

  const getTypeClass = (type) => {
    return type === 'CREDIT' 
      ? 'text-green-600 font-semibold' 
      : 'text-red-600 font-semibold';
  };

  const getTypeSymbol = (type) => {
    return type === 'CREDIT' ? '+' : '-';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-MA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !dashboard) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
        Vous n'avez aucun compte bancaire. Veuillez contacter votre agence.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Tableau de bord</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Sélection du compte (si plusieurs comptes) */}
      {comptes.length > 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un compte
          </label>
          <select
            value={selectedRib}
            onChange={handleCompteChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {comptes.map((compte) => (
              <option key={compte.id} value={compte.rib}>
                {compte.rib} - Solde: {compte.solde.toFixed(2)} DH
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Informations du compte */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm mb-2">Numéro de compte (RIB)</p>
            <p className="text-2xl font-mono font-bold mb-6">{dashboard.rib}</p>
            
            <p className="text-blue-200 text-sm mb-2">Solde disponible</p>
            <p className="text-4xl font-bold">{dashboard.solde.toFixed(2)} DH</p>
          </div>
          
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              dashboard.statut === 'OUVERT' ? 'bg-green-500' :
              dashboard.statut === 'BLOQUE' ? 'bg-red-500' :
              'bg-gray-500'
            }`}>
              {dashboard.statut}
            </span>
          </div>
        </div>
      </div>

      {/* Liste des opérations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {showAllOperations ? 'Historique des opérations' : 'Dernières opérations'}
          </h3>
          {!showAllOperations && dashboard.totalOperations > 10 && (
            <button
              onClick={() => loadAllOperations(0)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Voir tout ({dashboard.totalOperations} opérations)
            </button>
          )}
        </div>

        {(!showAllOperations ? dashboard.dernieres10Operations : operationsPage?.content || []).length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune opération</p>
        ) : (
          <div className="space-y-3">
            {(!showAllOperations ? dashboard.dernieres10Operations : operationsPage?.content || []).map((operation) => (
              <div
                key={operation.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{operation.intitule}</p>
                    {operation.motif && (
                      <p className="text-sm text-gray-600 mt-1">{operation.motif}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(operation.dateOperation)}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs mb-2 ${
                      operation.type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {operation.type}
                    </span>
                    <p className={getTypeClass(operation.type)}>
                      {getTypeSymbol(operation.type)} {operation.montant.toFixed(2)} DH
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {showAllOperations && operationsPage && operationsPage.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => loadAllOperations(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Précédent
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} sur {operationsPage.totalPages}
            </span>
            
            <button
              onClick={() => loadAllOperations(currentPage + 1)}
              disabled={operationsPage.last}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        )}

        {showAllOperations && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllOperations(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Afficher uniquement les 10 dernières
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;