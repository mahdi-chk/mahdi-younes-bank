import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import compteService from '../../services/compteService';

const CompteList = () => {
  const navigate = useNavigate();
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComptes();
  }, []);

  const fetchComptes = async () => {
    try {
      const data = await compteService.getAllComptes();
      setComptes(data);
    } catch (err) {
      setError('Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const filteredComptes = comptes.filter(compte =>
    compte.rib.includes(searchTerm) ||
    compte.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compte.clientPrenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'OUVERT':
        return 'bg-green-100 text-green-800';
      case 'BLOQUE':
        return 'bg-red-100 text-red-800';
      case 'CLOTURE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Liste des comptes bancaires</h2>
        <button
          onClick={() => navigate('/agent/add-account')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Nouveau compte
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un compte (RIB, nom du client)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  RIB
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date création
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComptes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Aucun compte trouvé
                  </td>
                </tr>
              ) : (
                filteredComptes.map((compte) => (
                  <tr key={compte.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">
                      {compte.rib}
                    </td>
                    <td className="px-6 py-4">
                      {compte.clientPrenom} {compte.clientNom}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {compte.solde.toFixed(2)} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatutBadgeClass(compte.statut)}`}>
                        {compte.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(compte.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Total: {filteredComptes.length} compte(s)
        </div>
      </div>
    </div>
  );
};

export default CompteList;